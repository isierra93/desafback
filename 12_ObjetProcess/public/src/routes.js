import {getProdMocks} from "../../public/contenedores/ProdMocks.js"
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// GET

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
    return res.render("fakerMocks", {productos: productos})
  }
  const productos = getProdMocks()
  res.render("fakerMocks", {productos: productos})
}

export function getAny(req, res) {
  res.redirect("/login")
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
  const pathExec = process.cwd().split("/")
  const pid = process.pid
  const carpProyecto = __dirname

  res.render("info", {usuario, argEntrada, plataforma, version, memoriaReservada,  pathExec, pid, carpProyecto})
}
// FUNCTIONS 
