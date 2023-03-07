import mongoose from "mongoose"

const usuariosColl = "usuarios"

const Schema = new mongoose.Schema({
  email: {type: String, required: true, max: 50},
  password: {type: String, required: true, max: 255},
  nombre: {type: String, required: true, max: 50},
  apellido: {type: String, required: true, max: 50},
  edad: {type: Number, required: true, min: 18},
  direccion: {type: String},
  numero: {type: String, required: true,},
  avatar: {type: String},
})

const usuarios = mongoose.model(usuariosColl, Schema)

export {
  usuarios,

}
