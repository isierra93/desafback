import { Router } from "express"
import Controller from "../Controller/controller.js"

const productosRouter = Router()

productosRouter.get("/:id?", Controller.getProds)
productosRouter.post("/", Controller.postProds)
productosRouter.put("/:id", Controller.putProd)
productosRouter.delete("/:id?", Controller.deleteProd)

export default productosRouter

