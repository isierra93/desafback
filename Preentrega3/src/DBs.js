import Productos from "./contenedores/mongohijos/Productos.js"
import Mensajes from "./contenedores/mongohijos/Mensajes.js"
import Usuarios from "./contenedores/mongohijos/Usuarios.js"
import Carritos from "./contenedores/mongohijos/Carritos.js"

const Users = new Usuarios()
const Messages = new Mensajes()
const Products = new Productos()
const Carros = new Carritos()

export {
  Users,
  Messages,
  Products,
  Carros
}
