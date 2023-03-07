import MongoContainer from "../MongoContainer.js"
import * as model from "../models/mensajesModel.js"
import * as logger from "../../Logger.js"

export default class Mensajes extends MongoContainer{
  constructor(){
    super()
  }
  
  //GET
  async getAll(){
    try {
      await this.connect()

      let res = await model.mensajes.find({},{__v:0})
      await this.disconnect()

      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getById(id){
    try {
      await this.connect()
      let res = await model.mensajes.find({_id:id},{__v:0})

      await this.disconnect()

      return res
    } catch (err) {
      logger.logError.error(err)
    }
  }

  //POST
  async save(obj){
    try {
      await this.connect()

      const nuevo = await model.mensajes(obj).save()
      
      await this.disconnect()

      return nuevo
    } catch (error) {
      logger.logError.error(err)
    }
  }

  //PUT
  async put(id, obj){
    try {
      await this.connect()

      let res = await model.mensajes.updateOne({_id: id}, obj)

      await this.disconnect()

      return res
    } catch (err) {
      logger.logError.error(err)
    }
  }

  //DELETE
  async deleteById(id){
    try {
      await this.connect()

      let res = await model.mensajes.deleteOne({_id: id})

      await this.disconnect()

      return res
    } catch (err) {
      logger.logError.error(err)
    }
  }
}
