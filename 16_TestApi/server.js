import express from "express"
import {Server} from "http"
import {Server as IOServer} from "socket.io"
import compression from "compression"
import {DOT_ENV} from "./src/Dot_Env_Input.js"
import MONGO_URL from "./Config/mongoURL.js"
import MONGO_OPTIONS from "./Config/mongoOPTIONS.js"
import baseRouter from "./Routers/baseRouter.js"
import apiRouter from "./Routers/apiRouter.js"
import MongoStore from "connect-mongo"
import session from "express-session"
import Logger from "./src/Logger.js"
import passport from "./Routers/Passport/passport.js"
import Controller from "./Controller/controller.js"

//import routers
const PUERTO = process.env.PORT || DOT_ENV.PORT
const app = express()
const httpServer = new Server(app)

export const io = new IOServer(httpServer)

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
app.use(passport.session())

app.use("/api", apiRouter)
app.use("/", baseRouter)

httpServer.listen(PUERTO, () => Logger.logConsola.info(`Server ON. Port: ${PUERTO}`))

io.on('connection', Controller.webSocket)
