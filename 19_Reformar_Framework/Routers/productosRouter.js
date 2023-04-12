import Router from "koa-router"
import Controller from "../Controller/controller.js"

const productosRouter = new Router({
  prefix:"/productos"
})

productosRouter.get("/:id?", Controller.getProds)
productosRouter.post("/", Controller.postProds)
productosRouter.put("/:id", Controller.putProd)
productosRouter.delete("/:id?", Controller.deleteProd)

export default productosRouter

