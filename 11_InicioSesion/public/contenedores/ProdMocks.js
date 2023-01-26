import {faker} from "@faker-js/faker"

export default function getProdMocks(cant = 5){
  const mocks = []
  for (let i = 0; i < cant; i++) {
    mocks.push({
      nombre: faker.commerce.productName(),
      precio: faker.random.numeric(4),
      foto: faker.image.imageUrl()
    })
  }
  return mocks
}