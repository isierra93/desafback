import { buildSchema } from "graphql"
export const graphQLschema = buildSchema(`
  type Producto {
    id: ID!,
    title: String,
    price: Float,
    thumbnail: String
  }

  input ProductoInput {
    title: String,
    price: Float,
    thumbnail: String
  }

  type Query {
    getProducto(id: String): Producto ,
    getAllProductos: [Producto]
  }
  type Mutation {
    createProducto(data: ProductoInput): Producto ,
    createProductos(data: [ProductoInput]): [Producto] ,
    actualizarProducto(id: String, data: ProductoInput): Producto ,
    eliminarProducto(id: String): Producto ,
    eliminarAllProductos: [Producto]
  }
`)