import ProductosDAODb from "../contenedores/DAOsMongo/ProductosDAODb.js"
/* import ProductosDAOFile from "../contenedores/DAOsFile/ProductosDAOFile.js"
import ProductosDAOMem from "../contenedores/DAOsMem/ProductosDAOMem.js" */
import {DOT_ENV} from "../../src/Dot_Env_Input.js"

let DAO
const inputDAO = DOT_ENV.DAO

switch (inputDAO){
  case "Mongo":
    DAO = ProductosDAODb.getInstance()
    break
  /* case "File":
    DAO = ProductosDAOFile.getInstance()
    break
  default: 
    DAO = ProductosDAOMem.getInstance()
    break */
  default:
    DAO = ProductosDAODb.getInstance()
    break
}

export default class ProductosDAOFactory {
  static getDAO(){
    return DAO
  }
}