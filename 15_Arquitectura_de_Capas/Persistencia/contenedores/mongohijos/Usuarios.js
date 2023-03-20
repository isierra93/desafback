import MongoContainer from "../MongoContainer.js"
import * as model from "../../models/usuariosModel.js"
import * as Logger from "../../../src/Logger.js"

export default class Usuarios extends MongoContainer{
  constructor(){
    super()
  }
  
  //GET
  async getAll(){
    try {
      await this.connect()

      let res = await model.usuarios.find({},{__v:0})
      await this.disconnect()

      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  async getById(id){
    try {
      await this.connect()

      let res = await model.usuarios.find({_id:id},{ __v:0})

      await this.disconnect()

      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  async getByEmail(email){
    try {
      await this.connect()

      let res = await model.usuarios.findOne({email: email},{__v:0})

      await this.disconnect()
      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  //POST
  async save(user){
    try {
      await this.connect()

      const nuevoUser = await model.usuarios.create(user)

      await this.disconnect()

      return nuevoUser
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  //PUT
  async put(userId, user){
    try {
      await this.connect()

      let res = await model.usuarios.updateOne({_id: userId}, user)

      await this.disconnect()

      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  //DELETE
  async deleteById(userId){
    try {
      await this.connect()

      let res = await model.usuarios.deleteOne({_id: userId})

      await this.disconnect()

      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  async deleteAll(){
    try {
      await this.connect()

      let res = await model.usuarios.deleteMany()

      await this.disconnect()

      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }
}

