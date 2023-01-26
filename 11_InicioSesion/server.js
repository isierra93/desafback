import Mensajes from "./public/contenedores/mongohijos/Mensajes.js"
import Usuarios from "./public/contenedores/mongohijos/Usuarios.js"
import {DBCliente} from "./public/contenedores/ContenedorSQL.js"
import express from "express"
import {Server } from "http"
import {Server as IOServer} from "socket.io"
import sqliteOptions from "./options/sqliteOpt.js"
import getProdMocks from "./public/contenedores/ProdMocks.js"
import chatSchema from "./config/chatSchema.js"
import {normalize} from "normalizr"
import util from "util"
import MongoStore from "connect-mongo"
import URL from "./config/urlMongo.js"
import session from "express-session"
import passport from "passport"
import * as passportLocal from "passport-local"

const LocalStrategy = passportLocal.Strategy
passport.use("login", new LocalStrategy(
  (username, password, next) => {


  })
)


const mongoAdvOpt = {useNewUrlParser:true, useUnifiedTopology:true}

// DDBB START

const ContMensajes = new Mensajes()
const ContProductos = new DBCliente(sqliteOptions, "productos")
ContProductos.crearTablaProductos()

// DDBB END
// SERVER START

const PORT = 8080
const app = express()
const httpServer = new Server(app)
const io = new IOServer(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("./public"))
app.set("view engine", "ejs")

//----------CONTINUA------------
// SESSION START

app.use(session({
  store: MongoStore.create({
    mongoUrl: URL,
    mongoOptions: mongoAdvOpt
  }),
  secret: "Es un secretito",
  resave: false,
  saveUninitialized: false,
  cookie:{
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 600000
  },
  rolling:true
}))

// SESSION END
//----------CONTINUA------------

app.get('/',isLogged, async (req, res) => {
  console.log(req.session.user)

  const chat = await ContMensajes.getAll()
  const chatLength = JSON.stringify(chat).length
  const chatNormalizadoLength = JSON.stringify(normalizarChat(chat)).length
  const porcentaje = Math.round(getCompPorcentaje(chatLength,chatNormalizadoLength))

  const username = req.session.user
  res.render("index", {porcentaje: porcentaje, usuario: username})
})

app.get("/signin", (req, res) => {
  
})

app.get("/login", (req, res) => {
  if(req.session.user){
    return res.redirect("/")
  }
  res.render("login")
})

app.get("/logout", (req, res) => {
  const username = req.session.user

  if(!username){
    return res.json( {error: "no hay una session activa"})
  }

  req.session.destroy( err => {
    if(err){
      return res.json({ status: "Logout ERROR", body: err})
    } else {
      res.render("logout", {usuario: username})
    }
  })
})

app.get("/api/productos-test/:cant?",isLogged, async (req, res) => {

  if(req.params.cant){
    const productos = getProdMocks(req.params.cant)
    return res.render("fakerMocks", {productos: productos})
  }
  const productos = getProdMocks()
  res.render("fakerMocks", {productos: productos})
})

app.post("/login", (req, res) => {
  const pass = "valido"

  if(req.body.password !== pass){
    return res.redirect("/login")
  }
  req.session.user = req.body.username
  res.redirect("/")
})

httpServer.listen(PORT, () => console.log(`Server ON port ${PORT}`))

// SERVER END
// WEBSOCKET START

io.on('connection', async (socket) =>{
  console.log('Un cliente se ha conectado')

  /* Guarda el array de todos los mensajes */
  const historialMensajes = await ContMensajes.getAll()
  /* Guarda el array de todos los productos */
  const historialProductos = await ContProductos.getAll()
  
  socket.emit('productos', historialProductos)
  
  //compresion  
  const chatNormalizado = normalizarChat(historialMensajes)

  console.log("chatnormalizado enviado por socket")
  io.sockets.emit('mensajes', chatNormalizado)

  socket.on('new-msg', async (message) => {
    console.log("mensaje nuevo");
    await ContMensajes.save(message)
    
    const historialMensajes = await ContMensajes.getAll()

    //compresion
    const chatNormalizado = normalizarChat(historialMensajes)

    io.sockets.emit('mensajes', chatNormalizado)
  })

  socket.on('new-product', async (data) => {
    await ContProductos.save(data)

    const historialProductos = await ContProductos.getAll()

    io.sockets.emit('productos', historialProductos)
  })
})

// WEBSOCKET END
// FUNCTIONS

function fancyLog(obj){
  console.log(util.inspect(obj,false,10,true))
}

function normalizarChat(obj){
  const stringifyData = JSON.stringify(obj)
  const parsedData = JSON.parse(stringifyData)
  
  let newId = 1
  parsedData.map( e => (e.id = newId++))
  obj = { id: 1, mensajes: parsedData }

  const objetoNormalizado = normalize(obj, chatSchema)
  return objetoNormalizado
}

function getCompPorcentaje(completo, comprimido){
  return (comprimido*100)/completo
}

function isLogged(req, res, next) {
  const user = req.session.user
  if(!user){
    return res.redirect("/login")
  } else {
    next()
  }
}