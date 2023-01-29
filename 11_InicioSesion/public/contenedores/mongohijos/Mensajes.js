import MongoContainer from "../MongoContainer.js"
import * as model from "../../../models/mensajesModel.js"

export default class Mensajes extends MongoContainer{
  constructor(){
    super()
  }
  
  //GET
  async getAll(){
    try {
      await this.connect()
      console.log("getAll msj Start")

      let res = await model.mensajes.find({},{__v:0})
      this.disconnect()
      console.log("getAll msj End")

      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getById(id){
    try {
      await this.connect()
      console.log("getById msj Start")
      let res = await model.mensajes.find({_id:id},{__v:0})

      this.disconnect()
      console.log("getById msj End")

      return res
    } catch (error) {
      console.log(error)
    }
  }

  //POST
  async save(obj){
    try {
      await this.connect()
      console.log("save msj Start")

      const nuevo = await model.mensajes(obj).save()
      
      this.disconnect()
      console.log("save msj End")

      return nuevo
    } catch (error) {
      console.log(error)
    }
  }

  //PUT
  async put(id, obj){
    try {
      await this.connect()
      console.log("put msj Start")

      let res = await model.mensajes.updateOne({_id: id}, obj)

      this.disconnect()
      console.log("put msj End")

      return res
    } catch (error) {
      console.log(error)
    }
  }

  //DELETE
  async deleteById(id){
    try {
      await this.connect()
      console.log("deleteById msj Start")

      let res = await model.mensajes.deleteOne({_id: id})

      this.disconnect()
      console.log("deleteById msj End")

      return res
    } catch (error) {
      console.log(error)
    }
  }
}
