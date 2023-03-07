import MongoContainer from "../MongoContainer.js"
import * as model from "../models/productosModel.js"
import * as Logger from "../../Logger.js"

export default class productos extends MongoContainer{
  constructor(){
    super()
  }
  
  //GET
  async getAll(){
    try {
      await this.connect()

      let res = await model.productos.find({},{__v:0})
      await this.disconnect()

      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getById(id){
    try {
      await this.connect()
      let res = await model.productos.findOne({_id:id},{__v:0})

      await this.disconnect()

      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  //POST
  async save(obj){
    try {
      await this.connect()

      const nuevo = await model.productos.create(obj)
      
      await this.disconnect()

      return nuevo
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  async saveMany(array){
    try {
      await this.connect()

      await model.productos.insertMany(array)

      /* for (let i = 0; i < array.length; i++) {
        Logger.logConsola.info( i+1 + " producto/s guardado de " + array.length )
      } */
      
      await this.disconnect()

      return cant
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  //PUT
  async put(id, obj){
    try {
      await this.connect()

      let res = await model.productos.updateOne({_id: id}, obj)

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

      let res = await model.productos.deleteOne({_id: id})

      await this.disconnect()

      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  async deleteAll(){
    try {
      await this.connect()

      let res = await model.productos.deleteMany()

      await this.disconnect()

      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }
}
