import {faker} from "@faker-js/faker"

const tagsFiltrables = ["deporte","cocina","ambiente","educación","formal","casual","barato"]

function getRandomDeArray(array){
  const indice = Math.floor(Math.random() * array.length)
    return array[indice]
}

function getProdMocks(cant = 25){
  const mocks = []
  for (let i = 0; i < cant; i++) {
    mocks.push({
      titulo: faker.commerce.productName(),
      precio: faker.random.numeric(4),
      thumbnail: faker.image.imageUrl(),
      tags: [getRandomDeArray(tagsFiltrables)]
    })
  }
  return mocks
}

export {
  getProdMocks,
  tagsFiltrables

}