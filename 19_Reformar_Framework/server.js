import Logger from "./src/Logger.js"
import MONGO_URL from "./Config/mongoURL.js"
import MONGO_OPTIONS from "./Config/mongoOPTIONS.js"
import {DOT_ENV} from "./src/Dot_Env_Input.js"
import koa from "koa"
import {Server} from "http"
import {koaBody} from "koa-body"
import bodyParser from "koa-bodyparser"
import {Server as IOServer} from "socket.io"
import passport from "./Routers/Passport/passport.js"
import render from "koa-ejs"
import views from "koa-views"
import compress from "koa-compress"
import session from "koa-session"
import MongoStore from "connect-mongo"
import apiRouter from "./Routers/apiRouter.js"
import baseRouter from "./Routers/baseRouter.js"
import productosRouter from "./Routers/productosRouter.js"
import Controller from "./Controller/controller.js"
import staticServe from "koa-static"

const PUERTO = process.env.PORT || DOT_ENV.PORT

const app = new koa()

app.use(views("./views", {autoRender: true, extension:"ejs"}))

app.use(apiRouter.routes())
app.use(productosRouter.routes())
app.use(baseRouter.routes())


app.use(passport.session())
app.use(staticServe("./public"))
app.use(koaBody())
app.use(bodyParser())

const sessionOpt = {
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
}
app.keys = ["secret"]
app.use(session(sessionOpt, app))

// app.use(compression())
app.use(compress())

const httpServer = new Server(app)

export const io = new IOServer(httpServer)

io.on('connection', Controller.webSocket)

//httpServer.listen(PUERTO, () => Logger.logConsola.info(`Server ON. Port: ${PUERTO}`))

app.listen(PUERTO, () => { Logger.logConsola.info(`Server ON. Port: ${PUERTO}`);})
