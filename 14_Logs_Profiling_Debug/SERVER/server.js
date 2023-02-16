import Mensajes from "./public/contenedores/mongohijos/Mensajes.js"
import Usuarios from "./public/contenedores/mongohijos/Usuarios.js"
import * as routes from "./public/src/routes.js"
import bCrypt from "bcrypt"
import {DBCliente} from "./public/contenedores/ContenedorSQL.js"
import express from "express"
import {Server } from "http"
import {Server as IOServer} from "socket.io"
import {sqliteOptions} from "./config/sqliteOpt.js"
import chatSchema from "./config/chatSchema.js"
import {normalize} from "normalizr"
import MongoStore from "connect-mongo"
import URL from "./config/urlMongo.js"
import session from "express-session"
import passport from "passport"
import {Strategy as LocalStrategy} from "passport-local"  
import dotenv from "dotenv"
import {DOT_ENV} from "./public/src/input.js"
import cluster from "cluster"
import os from "os"
import compression from "compression"
import * as logger from "./public/src/logger.js"

if (DOT_ENV.MODE !== "FORK" && DOT_ENV.MODE !== "CLUSTER") {
  logger.logConsola.info(`El modo: "${DOT_ENV.MODE}" es inválido. Opciones: "FORK"(default), "CLUSTER" .`);
  process.exit(0)
}
if (DOT_ENV.MODE === 'CLUSTER' && cluster.isPrimary) {
  const numCpus = os.cpus().length
  
  logger.logConsola.info('Número de procesadores: ' + numCpus)
  logger.logConsola.info('PID:' + process.pid)
  
  for (let i = 0; i < numCpus; i++) {
    cluster.fork()
  }

  cluster.on('exit', worker => {
    logger.logConsola.info(`Worker ${process.pid}: Desconectado`)
    cluster.fork()
  })
} else {


  dotenv.config({path:"C:/Users/Administrator/Desktop/BackendAlan/Curso-Programacion-Backend/Desafios/13_NGINX-1.23.3/SERVER/config/.env"})

  const {Router} = express
  const apiRouter = new Router()

  const mongoAdvOpt = {useNewUrlParser:true, useUnifiedTopology:true}

  // DDBB START

  const Users = new Usuarios()
  const Messages = new Mensajes()
  const Products = new DBCliente(sqliteOptions, "productos")
  Products.crearTablaProductos()

  // DDBB END
  // SERVER START

  const PUERTO = DOT_ENV.PORT
  const app = express()
  const httpServer = new Server(app)
  const io = new IOServer(httpServer)

  app.use(express.json())
  app.use(express.urlencoded({extended:true}))
  app.use(express.static("./public"))
  app.set("view engine", "ejs")
  
  app.use(logURLnMethod)
  app.use(compression())
  app.use("/api", apiRouter)

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
    rolling: true,
    cookie:{
      path: '/',
      httpOnly: false,
      secure: false,
      maxAge: 600000
    }
  }))

  // SESSION END
  // PASSPORT START

  app.use(passport.session())

  passport.use("login", new LocalStrategy(
    async (username, password, done) => {
      const acc = await Users.getByEmail(username)

      if(!acc){
        return done(null, false)
      }

      if(!isValidPassword(acc, password)){
        return done(null, false)
      }

      return done(null, acc)
    })
  )

  passport.use("signin", new LocalStrategy(
    async (username, password, done) => {
      const acc = await Users.getByEmail(username)
      
      if(acc){
        logger.logConsola.info("Este usuario ya existe");
        return done(null, false)
      }

      const newAcc = {
        email: username,
        password: createHash(password),
      }

      await Users.save(newAcc)

      return done(null, newAcc)
    })
  )

  passport.serializeUser((username, done) => {
    done(null, username.email)
  })

  passport.deserializeUser( async (email, done) => {
    const acc = await Users.getByEmail(email)

    done(null, acc)
  })

  // PASSPORT END
  //----------CONTINUA------------

  // INDEX
  app.get('/', checkAuthentication, async (req, res) => {
    const chat = await Messages.getAll()
    const chatLength = JSON.stringify(chat).length
    const chatNormalizado = normalizarChat(chat)
    const chatNormalizadoLength = JSON.stringify(chatNormalizado).length
    const porcentaje = Math.round(getCompPorcentaje(chatLength,chatNormalizadoLength))
    
    const username = req.user.email
    res.render("index", {porcentaje: porcentaje, usuario: username})
  })

  // SIGNIN
  app.get("/signin", routes.getSignin)
  app.post("/signin", passport.authenticate("signin", {failureRedirect: "/failSignin", successRedirect: "/login" }))
  app.get("/failSignin", routes.getFailSignin)

  // LOGIN
  app.get("/login", routes.getLogin)
  app.post("/login", passport.authenticate("login", {failureRedirect: "/failLogin", successRedirect: "/" }))
  app.get("/failLogin", routes.getFailLogin)

  // LOGOUT
  app.get("/logout", checkAuthentication, routes.getLogout)

  // MOCKS
  apiRouter.get("/productos-test/:cant?", routes.getAPIProdMocks)

  // INFO
  app.get("/info", routes.getInfo)
  app.get("/info-bloq", routes.getInfoBloq)
  
  // API
  //apiRouter.get("/randoms", routes.getApi)
  
  app.get("/favicon.ico", (req,res) => {
    logger.logDef.info(req.url)
  })
  // ANY
  app.get("*", routes.getAny)

  httpServer.listen(PUERTO, () => logger.logConsola.info(`Server ON. Port: ${PUERTO}`))

  // SERVER END
  // WEBSOCKET START

  io.on('connection', async (socket) =>{

    io.emit('productos', await Products.getAll())
    const chat = await Messages.getAll()
    const chatNormalizado = normalizarChat(chat)
    io.emit("mensajes", chatNormalizado)
    
    socket.on('new-msg', async (message) => {
      await Messages.save(message)
      
      //compresion
      const chatNormalizado = normalizarChat(await Messages.getAll())
      io.sockets.emit('mensajes', chatNormalizado)
    })

    socket.on('new-product', async (data) => {
      await Products.save(data)
      io.sockets.emit('productos', await Products.getAll())
    })
  })

  // WEBSOCKET END
  // FUNCTIONS middle

  function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
  }

  function logURLnMethod(req,res,next) {
    const { url } = req
    const urlExiste = routes.rutas.find( e => e == url)
    const { method } = req
    if(urlExiste ){
      logger.logConsola.info(
        `Ruta: "${url}". Method: ${method}`)
    } else if (url != "/favicon.ico") {
      logger.logWarning.error(
        `Ruta: "${url}". Method: ${method}`)
    }
    return next()
  }

  // FUNCTION normal
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

  function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password)
  }

  function createHash(password) {
    return bCrypt.hashSync(
      password,
      bCrypt.genSaltSync(10),
      null
    )
  }

}