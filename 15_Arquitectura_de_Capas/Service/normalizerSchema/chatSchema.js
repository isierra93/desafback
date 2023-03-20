import {schema} from "normalizr"

const user = new schema.Entity('autores',{},{ idAttribute: "email" })

const mensaje = new schema.Entity('mensajes',{ autor: user })

const chatSchema = new schema.Entity('chat', { mensajes: [mensaje] })

export default chatSchema
