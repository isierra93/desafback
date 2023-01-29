import MongoContainer from "../MongoContainer.js"
import * as model from "../../../models/usuariosModel.js"

export default class Usuarios extends MongoContainer{
  constructor(){
    super()
  }
  
  //GET
  async getAll(){
    try {
      await this.connect()
      console.log("getAll user Start")

      let res = await model.usuarios.find({},{__v:0})
      this.disconnect()
      console.log("getAll user End")

      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getById(id){
    try {
      await this.connect()
      console.log("getById user Start")
      let res = await model.usuarios.find({_id:id},{__v:0})

      this.disconnect()
      console.log("getById user End")

      return res
    } catch (error) {
      console.log(error)
    }
  }

  async getByEmail(email){
    try {
      await this.connect()
      console.log("getByEmail user Start")

      let res = await model.usuarios.findOne({email: email},{__v:0})

      this.disconnect()
      console.log("getByEmail user End")
      return res
    } catch (error) {
      console.log(error)
    }
  }

  //POST
  async save(obj){
    try {
      await this.connect()
      console.log("save user Start")

      const nuevo = await model.usuarios(obj).save()
      
      this.disconnect()
      console.log("save user End")

      return nuevo
    } catch (error) {
      console.log(error)
    }
  }

  //PUT
  async put(id, obj){
    try {
      await this.connect()
      console.log("put user Start")

      let res = await model.usuarios.updateOne({_id: id}, obj)

      this.disconnect()
      console.log("put user End")

      return res
    } catch (error) {
      console.log(error)
    }
  }

  //DELETE
  async deleteById(id){
    try {
      await this.connect()
      console.log("deleteById user Start")

      let res = await model.usuarios.deleteOne({_id: id})

      this.disconnect()
      console.log("deleteById user End")

      return res
    } catch (error) {
      console.log(error)
    }
  }
}
