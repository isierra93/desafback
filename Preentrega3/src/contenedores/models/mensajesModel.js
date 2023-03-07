import mongoose from "mongoose"

const mensajesColl = 'mensajes'

const Schema = new mongoose.Schema({
    autor:{ type: {
        email: {type: String, required: true, max: 50},
        nombre: {type: String, required: true, max: 50},
        apellido: {type: String, required: true, max: 50},
        edad: {type: Number, required: true},
        alias: {type: String, required: true, max: 50},
        avatar: {type: String, max: 50}
        }, required: true},
    text: {type: String, required: true},
    time: Date,
    id: {type: Number}
})

const mensajes = mongoose.model(mensajesColl, Schema)

export {
  mensajes,

}
