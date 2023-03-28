import getProductosDTO from "../DTOs/ProductosDTO.js"
import ProductosDAOFactory from "../Factory/ProductosDAOFactory.js"

export default class ProductosRepo{
  constructor(){
    this.DAO = ProductosDAOFactory.getDAO()
  }

  async getAll(){
    const ProductosDTOs = getProductosDTO(await this.DAO.getAll())
    return ProductosDTOs
  }

  async guardar(productos){
    const ProductosDTO = getProductosDTO(productos)
    await this.DAO.save(ProductosDTO)
  }
}