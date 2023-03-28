
class ProductosDto {
    constructor({ title, price, thumbnail }) {
      this.title= title
      this.price = price
      this.thumbnail = thumbnail
    }
  }

export default function getProductosDTO(data) {
  if (Array.isArray(data)) {
    return data.map(e => new ProductosDto(e))
  } else {
    return new ProductosDto(data)
  }
}
