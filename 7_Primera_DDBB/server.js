const DBCliente = require("./public/Contenedor")
const mariaOptions = require("./options/mariaOpt")
const sqliteOptions = require("./options/sqliteOpt")
const express = require("express")
const { Server: HttpServer } = require("http")
const { Server: IOServer } = require("socket.io")


const PORT = 8080

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("./public"))

app.set("view engine", "ejs")

//DDBB

const ContProductos = new DBCliente(mariaOptions, "productos")
const ContMensajes = new DBCliente(sqliteOptions, "mensajes")

ContMensajes.crearTablaMensajes()
ContProductos.crearTablaProductos()

app.get('/', async (req, res) => {

  const productos = await ContProductos.getAll()
  const mensajes = await ContMensajes.getAll()

  res.render("index", {productos: productos, mensajes: mensajes})
})


//WEBSOCKET

io.on('connection', async (socket) =>{
  console.log('Un cliente se ha conectado')

  /* Guarda el array de todos los mensajes */
  const historialMensajes = await ContMensajes.getAll()
  /* Guarda el array de todos los productos */
  const historialProductos = await ContProductos.getAll()
  
  socket.emit('productos', historialProductos)
  socket.emit('mensajes', historialMensajes)

  socket.on('new-msg', async (data) => {
    await ContMensajes.save(data)
    
    const historialMensajes = await ContMensajes.getAll()

    io.sockets.emit('mensajes', historialMensajes)
  })

  socket.on('new-product', async (data) => {
    await ContProductos.save(data)

    const historialProductos = await ContProductos.getAll()

    io.sockets.emit('productos', historialProductos)
  })
})

httpServer.listen(PORT, () => console.log(`Server ON port ${PORT}`))
