import mongoose from "mongoose"

const usuariosColl = "usuarios"

const Schema = new mongoose.Schema({
  email: {type: String, required: true, max: 50},
  password: {type: String, required: true, max: 255},
})

const usuarios = mongoose.model(usuariosColl, Schema)

export {
  usuarios,

}
