import {schema} from "normalizr"

const user = new schema.Entity('autor',{},{idAttribute: "email"})

const mensaje = new schema.Entity('mensaje',{autor: user}, {idAttribute: "id"})

const chatSchema = new schema.Entity('chat', {mensajes: [mensaje]},{idAttribute: "id"})

/* const comprimir = data => normalize(data, chat)
const descomprimir = dataNormal => denormalize(dataNormal.result, chat, dataNormal.entities) */

export default chatSchema
