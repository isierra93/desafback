import MongoContainer from "../MongoContainer.js"
import * as model from "../models/carritosModel.js"
import * as logger from "../../Logger.js"


export default class Carritos extends MongoContainer{
  constructor(){
    super()
  }

  //POST
  async crearCarrito(dueñoId){
    try {
      await this.connect()

      let carrito = await model.carritos.create({productos: [], dueño: dueñoId})
      
      await this.disconnect()
      return carrito._id
    } catch (error) {
      console.log(error)
    }
  }

  
  //GET
  async getAll(){
    try {
      await this.connect()

      let carritosId = await model.carritos.find({},{_id:1})

      await this.disconnect()
      return carritosId
    } catch (error) {
      console.log(error)
    }
  }

  async getById(id){
    try {
      await this.connect()

      let carrito = await model.carritos.find({_id:id})

      await this.disconnect()
      return carrito
    } catch (error) {
      console.log(error)
    }
  }

  async getCarritoIdByDueño(dueñoId){
    try {
      await this.connect()

      let carritoId = await model.carritos.find({ dueño: dueñoId},{_id:1})

      await this.disconnect()
      return carritoId
    } catch (error) {
      console.log(error)
    }
  }
  
  //PUT
  async añadirProductoById(carritoId, productoId){
    try {
      await this.connect()
      const carrito = await model.carritos.findById(carritoId)
      const productosActualizados = carrito.productos.push(productoId)

      let res = await model.carritos.updateOne({_id: carritoId}, {productos: productosActualizados})

      await this.disconnect()
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async eliminarProducto(carritoId) {}

  //DELETE
  async deleteById(id){
    try {
      await this.connect()
      
      let res = await model.carritos.deleteOne({_id: id})

      await this.disconnect()
      return res
    } catch (error) {
      console.log(error)
    }
  }
}