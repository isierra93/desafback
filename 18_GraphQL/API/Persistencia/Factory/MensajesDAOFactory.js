import MensajesDAODb from "../contenedores/DAOsMongo/MensajesDAODb.js"
/* import MensajesDAOFile from "../contenedores/DAOsFile/MensajesDAOFile.js"
import MensajesDAOMem from "../contenedores/DAOsMem/MensajesDAOMem.js" */
import {DOT_ENV} from "../../src/Dot_Env_Input.js"

let DAO
const inputDAO = DOT_ENV.DAO

switch (inputDAO){
  case "Mongo":
    DAO = MensajesDAODb.getInstance()
    break
  /* case "File":
    DAO = MensajesDAOFile.getInstance()
    break
  default: 
    DAO = MensajesDAOMem.getInstance()
    break */
  default:
    DAO = MensajesDAODb.getInstance()
    break
}

export default class MensajesDAOFactory {
  static getDAO(){
    return DAO
  }
}