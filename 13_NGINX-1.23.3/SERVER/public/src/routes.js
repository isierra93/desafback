import {getProdMocks} from "../../public/contenedores/ProdMocks.js"
import {fork} from "child_process"
import { DOT_ENV } from "./input.js"
// GET APP

export function getSignin(req, res) {
  res.render("signin")
}

export function getLogin(req, res) {
  if(req.isAuthenticated()){
    return res.redirect("/")
  }
  res.render("login")
}

export function getLogout(req, res) {
  const username = req.user.email
  req.session.destroy( err => {
    if(err){
      return res.json({ status: "Logout ERROR", body: err})
    } else {
      res.render("logout", {usuario: username})
    }
  })
}

export async function getAPIProdMocks (req, res) {
  if(req.params.cant){
    const productos = getProdMocks(req.params.cant)
    return res.render("fakerMocks", {productos})
  } else {
  const productos = getProdMocks()
  return res.render("fakerMocks", {productos})}
}

export function getFailSignin(req, res) {
  res.render("errorSignin")
}

export function getFailLogin(req, res) {
  res.render("errorLogin")
}

export function getInfo(req, res) {
  const usuario = req.user.email
  const argEntrada = process.argv.slice(2)
  const plataforma = process.platform
  const version = process.version
  const memoriaReservada = `${process.memoryUsage.rss()} bytes`
  const pathExec = process.cwd()
  const pid = process.pid
  const carpProyectoArray = pathExec.replace(/\\/g, '/').split("/")
  const carpProyecto = carpProyectoArray[carpProyectoArray.length-1]
  const port = DOT_ENV.PORT


  res.render("info", {usuario, argEntrada, plataforma, version, memoriaReservada,  pathExec, pid, carpProyecto, port})
}

export function getAny(req, res) {
  console.log(req.url)
  console.log("Como hago para que pare de llamar /favicon.ico");
  res.redirect("/")
}

// GET /API

export function getApi(req, res) {
  const {cant} = req.query || 100000000
  const forked = fork("public/src/getRandoms.js")
  forked.send({cant})
  forked.on("message", objeto => {
    res.json(objeto)})

  /* const objeto = getRandoms(cant)
  res.json(objeto) */
}

// FUNCTIONS

function getRandoms(cant) {
  const objeto = {}
  for (let i = 0; i < cant; i++) {
    const num = getRandomInt()
    if(objeto[num.valueOf()]){
      objeto[num.valueOf()]++
    }else{
      objeto[num.valueOf()] = 1
    }
  }
  return objeto
}

function getRandomInt(max= 1000) {
  return Math.ceil(Math.random() * max )
}