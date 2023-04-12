import {normalize} from "normalizr"
import chatSchema from "./chatSchema.js"

function normalizarChat(obj){
  const stringifyData = JSON.stringify(obj)
  const parsedData = JSON.parse(stringifyData)
  
  let newId = 1
  parsedData.map( e => (e.id = newId++))
  obj = { id: 1, mensajes: parsedData }

  const objetoNormalizado = normalize(obj, chatSchema)
  return objetoNormalizado
}

export default {
  normalizarChat,
  
}