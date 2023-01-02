import { getProductos, postProducto, putProducto, deleteProducto } from '../controladores/productos'
import { Router } from 'express'

const productosRouter = new Router()

productosRouter.get('/:id?', getProductos)
productosRouter.post('/',  postProducto)
productosRouter.put('/:id', putProducto)
productosRouter.delete('/:id', deleteProducto)

export * from "productosRouter.js";
