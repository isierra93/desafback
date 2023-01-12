import {Mensajes} from "./public/contenedores/mongohijos/mensajesContainer.js"
import {DBCliente} from "./public/ContenedorViejo.js"
import express from "express"
import {Server } from "http"
import {Server as IOServer} from "socket.io"
import sqliteOptions from "./options/sqliteOpt.js"
import chatSchema from "./public/src/schemaChat.js"
import {normalize} from "normalizr"
import util from "util"
import { mensajes } from "./models/mensajes.js"

const PORT = 8080

const app = express()
const httpServer = new Server(app)
const io = new IOServer(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("./public"))

app.set("view engine", "ejs")

//DDBB

const ContMensajes = new Mensajes()
const ContProductos = new DBCliente(sqliteOptions, "productos")
ContProductos.crearTablaProductos()

app.get('/', async (req, res) => {
  const chatNormalizado = normalizarChat(await ContMensajes.getAll())
  print(chatNormalizado)
  res.render("index")
})

app.get("/api/productos-test", async (req, res) => {
  res.json({error: "Aún no hice esta parte del desafío, maldito normalize D:"})
})

//WEBSOCKET

io.on('connection', async (socket) =>{
  console.log('Un cliente se ha conectado')

  /* Guarda el array de todos los mensajes */
  const historialMensajes = await ContMensajes.getAll()
  /* Guarda el array de todos los productos */
  const historialProductos = await ContProductos.getAll()
  
  socket.emit('productos', historialProductos)
  
  //compresion
  
  io.sockets.emit('mensajes', historialMensajes)

  socket.on('new-msg', async (message) => {
    console.log("mensaje nuevo");
    await ContMensajes.save(message)
    
    const historialMensajes = await ContMensajes.getAll()

    //compresion

    io.sockets.emit('mensajes', historialMensajes)
  })

  socket.on('new-product', async (data) => {
    await ContProductos.save(data)

    const historialProductos = await ContProductos.getAll()

    io.sockets.emit('productos', historialProductos)
  })
})

function print(obj){
  console.log(util.inspect(obj,false,12,true))
}
function normalizarChat(obj){
  const stringifyData = JSON.stringify(obj)
  const parsedData = JSON.parse(stringifyData)
  
  let newId = 1

  parsedData.map( e => (e.id = newId++))
  obj = { id: "chat", mensajes: parsedData }

  const objetoNormalizado = normalize(obj, chatSchema)
  return objetoNormalizado
}

httpServer.listen(PORT, () => console.log(`Server ON port ${PORT}`))
