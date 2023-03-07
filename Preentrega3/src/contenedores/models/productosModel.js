import mongoose from "mongoose"

const productosColl = 'productos'

const Schema = new mongoose.Schema({
    titulo: {type: String, required: true, max: 50},
    precio: {type: Number, required: true},
    thumbnail: {type: String},
    tags: [String]
})

const productos = mongoose.model(productosColl, Schema)

export {
  productos,
}
