import MongoContainer from "../MongoContainer.js"
import * as model from "../models/carritosModel.js"
import * as Logger from "../../Logger.js"


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
      Logger.logError.error(error)
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
      Logger.logError.error(error)
    }
  }

  async getById(carritoId){
    try {
      await this.connect()

      let carrito = await model.carritos.findOne({_id: carritoId},{__v:0})

      await this.disconnect()
      return carrito
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  async getCarritoIdByDueño(dueñoId){
    try {
      await this.connect()

      let carritoId = await model.carritos.findOne({ dueño: dueñoId},{_id:1})

      await this.disconnect()
      return carritoId
    } catch (error) {
      Logger.logError.error(error)
    }
  }
  
  //PUT
  async añadirProducto(carritoId, prodId){
    try {
      await this.connect()

      const carrito = await model.carritos.findById(carritoId)

      const carritoProds = carrito.productos

      carritoProds.push(prodId)

      let res = await model.carritos.updateOne({_id: carritoId}, {productos: carritoProds})

      await this.disconnect()
      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  async eliminarProducto(carritoId, prodId) {
    try {
      await this.connect()

      const carrito = await model.carritos.findById(carritoId)

      const carritoProdIds = carrito.productos
      if(carritoProdIds.length <= 1){
        let res = await this.deleteById(carritoId)
        
      await this.disconnect()
        return res
      }
      const sinProdId = []

      for (let i = 0; i < carritoProdIds.length; i++) {
        if (carritoProdIds[i] != prodId) {
          sinProdId.push(carritoProdIds[i])
        }
      }

      let res = await model.carritos.updateOne({_id: carritoId}, {productos: sinProdId})

      await this.disconnect()
      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  //DELETE
  async deleteById(id){
    try {
      await this.connect()
      
      let res = await model.carritos.deleteOne({_id: id})

      await this.disconnect()
      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }
}