import getMensajesDTO from "../DTOs/MensajesDTO.js"
import MensajesDAOFactory from "../Factory/MensajesDAOFactory.js"

export default class MensajesRepo{
  constructor(){
    this.DAO = MensajesDAOFactory.getDAO()
  }

  async getAll(){
    const MensajesDTO = getMensajesDTO(await this.DAO.getAll())
    return MensajesDTO
  }

  async guardar(mensajes){
    const MensajesDTO = getMensajesDTO(mensajes)
    await this.DAO.save(MensajesDTO)
  }
}