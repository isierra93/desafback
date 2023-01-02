import { getProductosCarrito, postProductoCarrito, putCarrito, deleteCarrito } from '../controladores/carritos'
import { Router } from 'express'

const carritoRouter = new Router()

carritoRouter.get('/:id?', getProductosCarrito)
carritoRouter.post('/', postProductoCarrito)
carritoRouter.put('/:id', putCarrito)
carritoRouter.delete('/:id', deleteCarrito)

export * from "carritosRouter.js";