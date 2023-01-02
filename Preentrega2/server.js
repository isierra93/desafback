import express from 'express'
import carritosRouter from "./routers/carritosRouter"
import productosRouter from "./routers/productosRouter"

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const app = express()
const PORT = 8080

app.use("/api/productos", carritosRouter)
app.use("/api/carrito", productosRouter)

const server = app.listen(PORT, () => {
  console.log("Por qué no arranca??")
})
server.on('error', err => {console.log(err)})