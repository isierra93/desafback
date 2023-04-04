import { cliente } from "./clienteAxios.js"
import { recursos } from "./clienteAxios.js"

async function test(){
  try {
    
  await cliente.getProductos()

  // Se puede intercambiar entre variosProds Y productoAxios, importados desde recursos
  const posted = await cliente.postProductos( recursos.variosProds )
  const { _id } = posted

  //Si hicimos POST de 1 producto, guarda su _id y recupera ese producto pero con GET(_id)
  //Si hicimos POST de varios productos, no lo encontrará, entonces pide todos con GET
  if(_id){
    await cliente.getProductos(_id)
    await cliente.putProducto(_id, recursos.modificacion)
    await cliente.getProductos(_id)

  }else {
    const { _id } = posted[2]
    await cliente.getProductos(_id)
    await cliente.putProducto(_id, recursos.modificacion )
    await cliente.getProductos(_id)
    await cliente.deleteProductos(_id)
  }
  await cliente.getProductos()
  await cliente.deleteProductos()
  await cliente.getProductos()

  } catch (error) {
    
  }
}

test()