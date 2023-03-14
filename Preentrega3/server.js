import cluster from "cluster"
import express from "express"
import {Server } from "http"
import {Server as IOServer} from "socket.io"
import MongoStore from "connect-mongo"
import passport from "passport"
import session from "express-session"
import compression from "compression"
import {MONGO_OPTIONS} from "./src/config/mongoOptions.js"
import {MONGO_URL} from "./src/config/mongoUrl.js"
import { DOT_ENV } from "./src/Dot_Env_Input.js"
import * as Faker from "./src/Faker.js"
import * as Logger from "./src/Logger.js"
import * as Passport from "./src/Passport.js"
import * as Multer from "./src/Multer.js"
import * as Routes from "./src/Routes.js"
import * as db from "./src/DBs.js"

if (DOT_ENV.MODE !== "FORK" && DOT_ENV.MODE !== "CLUSTER") {
  Logger.logConsola.info(`El modo: "${DOT_ENV.MODE}" es inválido. Opciones: "FORK"(default), "CLUSTER" .`);
  process.exit(0)
}
if (DOT_ENV.MODE === 'CLUSTER' && cluster.isPrimary){
  const numCpus = os.cpus().length
  
  Logger.logConsola.info('Número de procesadores: ' + numCpus)
  Logger.logConsola.info('PID:' + process.pid)
  
  for (let i = 0; i < numCpus; i++) {
    cluster.fork()
  }

  cluster.on('exit', worker => {
    Logger.logConsola.info(`Worker ${process.pid}: Desconectado`)
    cluster.fork()
  })
} else {
  
  const PUERTO = process.env.PORT || DOT_ENV.PORT

  // Server Setup
  const app = express()
  const httpServer = new Server(app)
  const io = new IOServer(httpServer)
  // App Uses
  app.use(express.json())
  app.use(express.urlencoded({extended:true}))
  app.use(express.static("./public"))
  app.set("view engine", "ejs")
  app.use(compression())
  app.use(session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: MONGO_OPTIONS
    }),
    secret: "sSsecreto",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      path: '/',
      httpOnly: false,
      secure: false,
      maxAge: 600000
    }
  }))
  app.use(passport.session())

  // Passport
  passport.use( "login", Passport.Login )
  passport.use( "signin", Passport.Signin )
  passport.serializeUser( Passport.Serializar )
  passport.deserializeUser( Passport.Deserializar )
  
    // App Requests // Router
  // login  
  app.get("/login", Routes.getLogin)
  app.post("/login", passport.authenticate("login", {failureRedirect: "/failLogin", successRedirect: "/" }))
  app.get("/failLogin", Routes.getFailLogin)
  // logout
  app.get("/logout", checkAuthentication, Routes.getLogout )
  //signin
  app.get("/signin", Routes.getSignin )
  app.post("/signin",
    Multer.upload.single("avatar"),
    passport.authenticate("signin", {failureRedirect: "/failSignin", successRedirect: "/" })
  ) 
  app.get("/failSignin", Routes.getFailSignin)
  // "/"
  app.get("/", checkAuthentication, Routes.getIndex)
  // productos
  app.get("/productos/:filtros?", checkAuthentication, Routes.getProductos)
  app.post("/productos", Routes.postProductos, Routes.postProductos)
  // carrito
  app.get("/carrito", checkAuthentication, Routes.getCarrito)
  app.get("/addCarritoProd/:email/:prodId", checkAuthentication, Routes.getAddCarritoProd)
  app.get("/deleteCarritoProd/:email/:prodId", checkAuthentication, Routes.getDeleteCarritoProd)
  // perfil
  app.get("/perfil", checkAuthentication, Routes.getPerfil)
  // avatarChange
  app.post("/avatarChange", checkAuthentication, Multer.upload.single("newAvatar"), Routes.FileCheck, Routes.postAvatarChange)
  // pedidoCarrito
  app.get("/pedidoCarrito/:email/:productosId", checkAuthentication, Routes.getPedidoCarrito)
  // Server ON
  httpServer.listen(PUERTO, () => {
    Logger.logConsola.info(`Server iniciado desde el puerto ${PUERTO} en modo ${DOT_ENV.MODE}`)
  })

  // Websocket io

  io.on('connection', async (socket) => {

    
    socket.on("addMocks", async (data) => {
      const prodMocks = Faker.getProdMocks()
      
      await db.Products.saveMany(prodMocks)
    })
    
    socket.on("deleteAllProductos", async (data) => {
      await db.Products.deleteAll()
    })

  })

  function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
  }
  
}