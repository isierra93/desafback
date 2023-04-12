import Service from "../Service/Service.js"
import { getProdMocks } from "../Persistencia/contenedores/ProdMocks.js"
import { fork } from "child_process"

async function checkAuthentication(ctx) {
  if(ctx.isAuthenticated()){
    const {url} = ctx
      ctx.redirect(url);
  } else{
      ctx.redirect("/login");
  }
}
async function getLogin(ctx) {
  ctx.render("login")
}
async function getFailLogin(ctx) {
  ctx.render("errorLogin")
}
async function getLogout(ctx) {
  const username = ctx.req.user.email
  ctx.req.session.destroy( err => {
    if(err){
      return ctx.body = { status: "Logout ERROR", body: err}
    } else {
      ctx.render("logout", {usuario: username})
    }
  })
}
async function getSignin(ctx) {
  ctx.render("signin")
}
async function getFailSignin(ctx) {
  ctx.render("errorSignin")
}
async function getIndex(ctx) {
  const porcentaje = await Service.getPorcentajeNormalizacion()
  //const username = ctx.req.user.email 
  const username = "AlanProbando"
  await ctx.render("index", {
    porcentaje: porcentaje, 
    usuario: username
  })
}
async function getInfo(ctx) {
  const info = Service.getInfo()
  await ctx.render("info", { ...info})
}
async function getAny(ctx) {
  ctx.redirect("/")
}
async function getApiProdMocks (ctx) {
  if(ctx.params.cant){
    const productos = getProdMocks(ctx.params.cant)
    return ctx.render("fakerMocks", {productos})
  } else {
  const productos = getProdMocks()
  return ctx.render("fakerMocks", {productos})}
}
async function getRandoms(req, res) {
  const {cant} = req.query || 100000000
  const forked = fork("Service/Service.js")
  forked.send({cant})
  forked.on("message", objeto => {
    res.json(objeto)})
}

async function getProds(ctx){
  let result
  const {id} = ctx.params

  if(id){
    result = await Service.getProductoById(id)
  } else {
    result = await Service.getAllProductos()
  }
  ctx.body = result
}
async function postProds(ctx){
  const productos = ctx.body

  const result = await Service.guardarProductos(productos)
  ctx.body = result
}

async function putProd(ctx){
  const {id} = ctx.params
  const producto = ctx.body

  const result = await Service.actualizarProducto(id, producto)

  res.json(result)

}
async function deleteProd(ctx) {
  const {id} = ctx.params
  const result = await Service.eliminar(id)

  ctx.body = result
}

import {io} from "../server.js"

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
  webSocket,
  getProds,
  postProds,
  putProd,
  deleteProd,

}