import { graphqlHTTP } from "express-graphql"
import { graphQLschema } from "../Config/graphqlSchema.js"
import Service from "../Service/Service.js"

export const graphHTTP = graphqlHTTP({
  schema: graphQLschema,
  rootValue: {
    getProducto,
    getAllProductos,
    createProducto,
    createProductos,
    actualizarProducto,
    eliminarProducto,
    eliminarAllProductos
  },
  graphiql: true
})

async function getProducto({id}){
  const result = await Service.getProductoById(id)
  return result
}
async function getAllProductos(){
  const result = await Service.getAllProductos()
  return result
}
async function createProducto({data}){
  const productos = data

  const result = await Service.guardarProductos(productos)
  return result
}
async function createProductos({data}){
  const productos = data

  const result = await Service.guardarProductos(productos)
  return result
}
async function actualizarProducto({id, data}){
  const producto = data

  const result = await Service.actualizarProducto(id, producto)

  return result
}
async function eliminarProducto({id}){
  const result = await Service.eliminar(id)
  return result
}
async function eliminarAllProductos(){
  const result = await Service.eliminar()
  return result
}
