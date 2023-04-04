import { clienteMocha } from "./clienteAxios.js"
import { recursos } from "./clienteAxios.js"
import { expect } from "chai"

function sacarProductoKeys(data){
  return {
    title: data.title,
    price: data.price,
    thumbnail : data.thumbnail,
  }
}

describe("Probando la apiREST Productos, empieza siempre vacía", function() {
  this.timeout(5000)

  this.beforeEach(function(){
    clienteMocha.deleteProductosMocha()
  })

  it("GET: GET all, devuelve array vacío", async function(){
    const response = await clienteMocha.getProductosMocha()

    expect(response.length).to.equal(0)
  })

  it("POST: POST solo 1 producto, devuelve un array.length de 1", async function(){
    await clienteMocha.postProductosMocha(recursos.productoAxios)
    const response = await clienteMocha.getProductosMocha()

    expect(response.length).to.equal(1)
  })

  it("POST: POST solo 1 producto, devuelve el mismo producto, ignoro su '__v' y '_id' ", async function(){
    const response = await clienteMocha.postProductosMocha(recursos.productoAxios)

    const posteado = sacarProductoKeys(response)

    expect(posteado).to.deep.equal(recursos.productoAxios)
  })

  it("PUT: post 1 producto, hago PUT y luego get del mismo, devuelve el producto actualizado", async function(){

    const { _id } = await clienteMocha.postProductosMocha(recursos.productoAxios)

    await clienteMocha.putProductoMocha(_id, recursos.modificacion)

    const response = await clienteMocha.getProductosMocha(_id)

    const modificado = sacarProductoKeys(response)

    expect(modificado).to.deep.equal(recursos.modificacion)

  })

  it("DELETE: post varios productos, hago DELETE el primero de ellos, devuelve array.length == variosProds.length-1", async function(){
    let productos

    const cantidadEsperada = recursos.variosProds.length - 1

    productos = await clienteMocha.postProductosMocha(recursos.variosProds)
    await clienteMocha.deleteProductosMocha(productos[0]._id)
    productos = await clienteMocha.getProductosMocha()
    const cantidadDevuelta = productos.length
    
    expect(cantidadDevuelta).to.equal(cantidadEsperada)

  })
  it("DELETE: post varios productos, hago DELETE de uno de ellos, si lo busco me devuelve undefined", async function(){
    let productos

    productos = await clienteMocha.postProductosMocha(recursos.variosProds)
    const id = productos[0]._id
    await clienteMocha.deleteProductosMocha(id)
    const productoEliminado = await clienteMocha.getProductosMocha(id)
    expect(productoEliminado).to.equal(undefined)
  })
})