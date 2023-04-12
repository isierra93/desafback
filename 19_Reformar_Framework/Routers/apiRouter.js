import Router from "koa-router"
import Controller from "../Controller/controller.js"


const apiRouter = new Router({
  prefix:"/api"
})
  
apiRouter.get("/productos-test/:cant?", Controller.getApiProdMocks)
apiRouter.get("/randoms", Controller.getRandoms)

export default apiRouter