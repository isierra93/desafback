import { Router } from "express"
import Controller from "../Controller/controller.js"


const apiRouter = Router()

apiRouter.get("/productos-test/:cant?", Controller.getApiProdMocks)
apiRouter.get("/randoms", Controller.getRandoms)

export default apiRouter