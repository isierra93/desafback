import mongoose from "mongoose"

const usuariosColl = "usuarios"

const Schema = new mongoose.Schema({
  email: {type: String, required: true, max: 50},
  contraseña: {type: String, required: true, max: 255}
})
export const usuarios = mongoose.model(usuariosColl, Schema)
