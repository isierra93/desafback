let instance = null

export default class MensajesDAOMem {
  constructor(){
    this.Mensajes = []
  }

  static getInstance() {
    if (!instance){
      instance = new MensajesDao()
    }
    return instance
  }

  //GET
  getAll(){
    return this.Mensajes
  }

  getById(id){
    return this.Mensajes.find( mensaje => mensaje._id == id )
  }

  //POST
  save(obj){
    this.Mensajes.push(obj)
  }

  //PUT
  putById(id, obj){
    
  }

  putAll(obj){
    
  }

  //DELETE
  deleteById(id){
    
  }

  deleteAll(){
  
  }
}