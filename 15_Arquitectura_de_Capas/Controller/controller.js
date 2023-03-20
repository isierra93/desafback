import Service from "../Service/Service.js"
import {getProdMocks} from "../Persistencia/contenedores/ProdMocks.js"
import {fork} from "child_process"

function checkAuthentication(req, res, next) {
  if(req.isAuthenticated()){
      next();
  } else{
      res.redirect("/login");
  }
}
async function getLogin(req, res) {
  res.render("login")
}
async function getFailLogin(req, res) {
  res.render("errorLogin")
}
async function getLogout(req, res) {
  const username = req.user.email
  req.session.destroy( err => {
    if(err){
      return res.json({ status: "Logout ERROR", body: err})
    } else {
      res.render("logout", {usuario: username})
    }
  })
}
async function getSignin(req, res) {
  res.render("signin")
}
async function getFailSignin(req, res) {
  res.render("errorSignin")
}
async function getIndex(req, res) {
  const porcentaje = await Service.getPorcentajeNormalizacion()
  const username = req.user.email 

  res.render("index", {porcentaje: porcentaje, usuario: username})
}
async function getInfo(req, res) {
  const info = Service.getInfo()
  res.render("info", { ...info})
}
async function getAny(req, res) {
  res.redirect("/")
}
async function getApiProdMocks (req, res) {
  if(req.params.cant){
    const productos = getProdMocks(req.params.cant)
    return res.render("fakerMocks", {productos})
  } else {
  const productos = getProdMocks()
  return res.render("fakerMocks", {productos})}
}
function getRandoms(req, res) {
  const {cant} = req.query || 100000000
  const forked = fork("Service/Service.js")
  forked.send({cant})
  forked.on("message", objeto => {
    res.json(objeto)})
}
async function webSocket(socket) {
  socket.emit('productos', await Service.getAllProductos())
  
  const chatNormalizado = await Service.getAllMensajesNormalizados()
  socket.emit("mensajes", chatNormalizado)

  socket.on('new-msg', async (message) => {
    await Service.guardarMensaje(message)
    //compresion
    const chatNormalizado = await Service.getAllMensajesNormalizados()
    io.sockets.emit('mensajes', chatNormalizado)
  })

  socket.on('new-product', async (data) => {
    await Service.guardarProducto(data)
    io.sockets.emit('productos', await Service.getAllProductos())
  })
}

export default {
  checkAuthentication,
  getLogin,
  getFailLogin,
  getLogout,
  getSignin,
  getFailSignin,
  getIndex,
  getInfo,
  getAny,
  getApiProdMocks,
  getRandoms,
  webSocket
}