import MongoContainer from "../MongoContainer.js"
import * as model from "../../../models/mensajes.js"

export class Mensajes extends MongoContainer{
  constructor(){
    super()
  }
  
  //GET
  async getAll(){
    try {
      await this.connect()
      console.log("getAll Start")

      let res = await model.mensajes.find()
      this.disconnect()
      console.log("getAll End")

      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getById(id){
    try {
      await this.connect()
      console.log("getById Start")
      let res = await model.mensajes.find({_id:id})

      this.disconnect()
      console.log("getById End")

      return res
    } catch (error) {
      console.log(error)
    }
  }

  //POST
  async save(obj){
    try {
      await this.connect()
      console.log("save Start")

      await model.mensajes(obj).save()
      
      this.disconnect()
      console.log("save End")

      return obj
    } catch (error) {
      console.log(error)
    }
  }

  //PUT
  async put(id, obj){
    try {
      await this.connect()
      console.log("put Start")

      let res = await model.mensajes.updateOne({_id: id}, obj)

      this.disconnect()
      console.log("put End")

      return res
    } catch (error) {
      console.log(error)
    }
  }

  //DELETE
  async deleteById(id){
    try {
      await this.connect()
      console.log("deleteById Start")

      let res = await model.mensajes.deleteOne({_id: id})

      this.disconnect()
      console.log("deleteById End")

      return res
    } catch (error) {
      console.log(error)
    }
  }
}
