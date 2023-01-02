import mongoose from "mongoose"

const productosColl = 'productos'

const Schema = new mongoose.Schema({
    title: {type: String, required: true, max: 50},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    code: {type: String, required: true, unique: true},
    timestamp: {type: Date, default: Date.now},
    description: {type: String},
    image: {type: String}
})

const productosModel = mongoose.model(productosColl, Schema)
