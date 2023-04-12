import ProductosRepository from "../Persistencia/Repository/ProductosRepository.js"
import MensajesRepository from "../Persistencia/Repository/MensajesRepository.js"
import Normalizacion from "./normalizerSchema/normalizacion.js"
import {DOT_ENV} from "../src/Dot_Env_Input.js"
import os from "os"

// const MensajesRepo = MensajesDAOFactory.getDAO()
// const ProductosRepo = ProductosDAOFactory.getDAO()
// const Users = UsuariosDAOFactory.getDAO()
const MensajesRepo = new MensajesRepository()
const ProductosRepo = new ProductosRepository()

async function getPorcentajeNormalizacion(){
  const chat = await MensajesRepo.getAll()
  const chatLength = JSON.stringify(chat).length
  const chatNormalizado = Normalizacion.normalizarChat(chat)
  const chatNormalizadoLength = JSON.stringify(chatNormalizado).length
  return Math.round(getCompPorcentaje(chatLength,chatNormalizadoLength))
}
function getInfo(){
  const argEntrada = process.argv.slice(2)
  const plataforma = process.platform
  const version = process.version
  const memoriaReservada = `${process.memoryUsage.rss()} bytes`
  const cpus = os.cpus().length
  const pathExec = process.cwd()
  const pid = process.pid
  const carpProyectoArray = pathExec.replace(/\\/g, '/').split("/")
  const carpProyecto = carpProyectoArray[carpProyectoArray.length-1]
  const port = DOT_ENV.PORT
  const mode = DOT_ENV.MODE

  const info = {
    argEntrada,
    plataforma,
    version,
    memoriaReservada,
    cpus,
    pathExec,
    pid,
    carpProyectoArray,
    carpProyecto,
    port,
    mode
  }

  return info
}
async function getAllProductos(){
  return await ProductosRepo.get()
}
async function getProductoById(id){
  return await ProductosRepo.get(id)
}
async function getAllProductosNormalizados(){
  return Normalizacion.normalizarChat(await getAllProductos())
}
async function guardarProductos(productos){
  return await ProductosRepo.guardar(productos)
}
async function getAllMensajes(){
  return await MensajesRepo.getAll()
}
async function getAllMensajesNormalizados(){
  return Normalizacion.normalizarChat(await getAllMensajes())
}
async function guardarMensaje(mensaje){
  return await MensajesRepo.guardar(mensaje)
}
async function actualizarProducto(id, producto){
  const actualizado = await ProductosRepo.actualizar(id, producto)
  return actualizado
}
async function eliminar(id){
  const res = await ProductosRepo.delete(id)
  return res
}

function getCompPorcentaje(completo, comprimido){
  return (comprimido*100)/completo
}

process.on("message", async msg => {
  const objeto = await getRandoms(msg.cant)
  process.send(objeto)
})

async function getRandoms(cant = 100000000) {
  const Randoms = {}
  for (let i = 0; i < cant; i++) {
    const num = getRandomInt()
    if(!Randoms[num.valueOf()]){
      Randoms[num.valueOf()] = 1
    }else{
      Randoms[num.valueOf()]++
    }
  }
  return Randoms
}

function getRandomInt(max = 1000) {
  return Math.ceil(Math.random() * max )
}

export default {
  getPorcentajeNormalizacion,
  getInfo,
  getAllProductos,
  getAllProductosNormalizados,
  guardarProductos,
  getAllMensajes,
  getAllMensajesNormalizados,
  guardarMensaje,
  getRandoms,
  getRandomInt,
  eliminar,
  actualizarProducto,
  getProductoById
}