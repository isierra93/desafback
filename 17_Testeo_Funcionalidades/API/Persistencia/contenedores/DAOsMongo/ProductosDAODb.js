import MongoContainer from "../MongoContainer.js"
import * as model from "../../models/productosModel.js"
import Logger from "../../../src/Logger.js"

let instance = null

export default class ProductosDao extends MongoContainer{
  constructor(){
    super()
  }
  
  static getInstance() {
    if (!instance){
      instance = new ProductosDao()
    }
    return instance
  }
  
  //GET
  async getAll(){
    try {
      await this.connect()

      let productos = await model.productos.find({},{__v:0})
      
      await this.disconnect()
      return productos
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  async getById(id){
    try {
      await this.connect()
      let producto = await model.productos.findOne({_id:id},{__v:0})

      await this.disconnect()

      return producto
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  async getByTags(tags){
    try {
      await this.connect()

      let allProductos = await model.productos.find({},{__v:0})

      const productosFiltrados = this.filtrarProductos(allProductos, tags)

      await this.disconnect()

      return productosFiltrados
    } catch (error) {
      Logger.logError.error(error)
    }
  }
  //POST
  async save(productos){
    try {
      await this.connect()

      let created
      if(Array.isArray(productos)){
        created = await model.productos.insertMany(productos)
      }
      else{
        created = await model.productos.create(productos)
      }
      
      await this.disconnect()

      return created
      
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  //PUT
  async putById(prodId, producto){
    try {
      await this.connect()

      let res = await model.productos.updateOne({_id: prodId}, producto)

      await this.disconnect()

      return res
    } catch (error) {
      Logger.logError.error(error)
    }
  }

  //DELETE
  async deleteById(prodId){
    try {
      await this.connect()

      let res = await model.productos.findByIdAndDelete(prodId)

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

  // AUXILIARES

  filtrarProductos(allProductos, tags){

    let productosFiltrados = []
    
    for (let i = 0; i < allProductos.length; i++) {
      const prodTags = allProductos[i].tags
      if (!this.isElementoInArreglo(allProductos[i], productosFiltrados)) {
        let j = 0
        while (j < prodTags.length) {
          if (this.isElementoInArreglo(prodTags[j], tags)) {
            productosFiltrados.push(allProductos[i])
          }
          j++
        }
      }
      i++
    }

    return productosFiltrados
  }

  isElementoInArreglo(element, arreglo){

    let i = 0
    while (i < arreglo.length) {
      if (arreglo[i] == element) {
        return true
      }
      i++
    }
    return false
  }

}
