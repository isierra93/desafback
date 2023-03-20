import Mensajes from "../Persistencia/contenedores/mongohijos/Mensajes.js"
import Usuarios from "../Persistencia/contenedores/mongohijos/Usuarios.js"
import Productos from "../Persistencia/contenedores/mongohijos/Productos.js"
import Normalizacion from "./normalizerSchema/normalizacion.js"
import os from "os"
import {DOT_ENV} from "../src/Dot_Env_Input.js"

const Messages = new Mensajes()
const Users = new Usuarios()
const Products = new Productos()

async function getPorcentajeNormalizacion(){
  const chat = await Messages.getAll()
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

  return {
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
}

async function getAllProductos(){
  return await Products.getAll()
}
async function getAllProductosNormalizados(){
  return Normalizacion.normalizarChat(await getAllProductos())
}
async function guardarProducto(producto){
  return await Products.save(producto)
}
async function getAllMensajes(){
  return await Messages.getAll()
}
async function getAllMensajesNormalizados(){
  return Normalizacion.normalizarChat(await getAllMensajes())
}
async function guardarMensaje(mensaje){
  return await Messages.save(mensaje)
}

function getCompPorcentaje(completo, comprimido){
  return (comprimido*100)/completo
}

process.on("message", async msg => {
  const objeto = await getRandoms(msg.cant)
  process.send(objeto)
})

async function getRandoms(cant = 100000000) {
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

function getRandomInt(max = 1000) {
  return Math.ceil(Math.random() * max )
}

export default {
  getPorcentajeNormalizacion,
  getInfo,
  getAllProductos,
  getAllProductosNormalizados,
  guardarProducto,
  getAllMensajes,
  getAllMensajesNormalizados,
  guardarMensaje,
  getRandoms,
  getRandomInt
}