import { Router } from "express"
import apiRouter from "./apiRouter.js"
import productosRouter from "./productosRouter.js"
import Controller from "../Controller/controller.js"
import passport from "./Passport/passport.js"
import * as ControllerGraphQL from "../Controller/productosGraphQL.js"

const baseRouter = Router()

baseRouter.get("/", Controller.checkAuthentication, Controller.getIndex )
baseRouter.get("/login", Controller.getLogin)
baseRouter.post("/login", passport.authenticate("login", {failureRedirect: "/failLogin", successRedirect: "/" }))
baseRouter.get("/failLogin", Controller.getFailLogin)
baseRouter.get("/logout", Controller.checkAuthentication, Controller.getLogout )
baseRouter.get("/signin", Controller.getSignin )
baseRouter.post("/signin", passport.authenticate("signin", {failureRedirect: "/failSignin", successRedirect: "/login" }))
baseRouter.get("/failSignin", Controller.getFailSignin )
baseRouter.get("/info", Controller.checkAuthentication, Controller.getInfo )

baseRouter.use("/graphql", ControllerGraphQL.graphHTTP)


baseRouter.use("/api", apiRouter)
baseRouter.use("/productos", productosRouter)


/* baseRouter.get("/productos/:id?", Controller.getProds)
baseRouter.post("/productos", Controller.postProds)
baseRouter.put("/productos/:id", Controller.putProd)
baseRouter.delete("/productos/:id?", Controller.deleteProd) */

baseRouter.get("*", Controller.getAny)


export default baseRouter

