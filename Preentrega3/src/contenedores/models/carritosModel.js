import mongoose from "mongoose"

const carritosColl = 'carritos'

const Schema = new mongoose.Schema({
  productos: {type: Array},
  timestamp: {type: Date, default: Date.now}
})

const carritos = mongoose.model(carritosColl, Schema)

export {
  carritos,
}