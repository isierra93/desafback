import axios from "axios"

// Recursos para ambas pruebas

const url = "http://localhost:3000/productos/"
const modificacion = { 
  title: "productoModificado",
  price: 1010,
  thumbnail: "thumbnailModificado"
}
const variosProds = [
  {
    title: "productoAxios1" ,
    price: 1111,
    thumbnail: "thumbnailAxios1"
  },{
    title: "productoAxios2" ,
    price: 2222,
    thumbnail: "thumbnailAxios2"
  },{
    title: "productoAxios3" ,
    price: 3333,
    thumbnail: "thumbnailAxios3"
  },{
    title: "productoAxios4" ,
    price: 4444,
    thumbnail: "thumbnailAxios4"
  }
]
const productoAxios = {
  title: "productoAxios" ,
  price: 1000,
  thumbnail: "thumbnailAxios"
}

// Funciones de pruebas manuales

async function getProductos(id){
  try {
    let result
    if (id){
      const { data } = await axios.get(url + id)
      console.log("getProducto:");
      console.log(data)
      result = data
    } else {
      const { data } = await axios.get(url)
      console.log("getProductos:");
      console.log(data)
      result = data
    }
    return result
  } catch (error) {
    console.log(error);
  }
}
async function postProductos(productos){
  try {
    const { data } = await axios.post(url, productos)
    console.log("postProductos:")
    console.log(data);
    return data

  } catch (error) {
    console.log(error);
  }
}
async function putProducto(id, producto){
  try {
    const { data } = await axios.put(url + id, producto)
    console.log("putProducto:")
    console.log(data)
    return data

  } catch (error) {
    console.log(error);
  }
}
async function deleteProductos(id){
  try {
    let result
    if (id){
      const { data } = await axios.delete(url + id)
      console.log("deleteProducto:")
      console.log(data);
      result = data
    } else {
      const { data } = await axios.delete(url)
      console.log("deleteProductos:")
      console.log(data);
      result = data
    }
    return result

  } catch (error) {
    console.log(error);
  }
}

// Funciones de pruebas en mocha (no tienen console logs)

async function getProductosMocha(id){
  try {
    let result
    if (id){
      const { data } = await axios.get(url + id)
/*       console.log("getProducto:");
      console.log(data) */
      result = data
    } else {
      const { data } = await axios.get(url)
/*       console.log("getProductos:");
      console.log(data) */
      result = data
    }
    return result
  } catch (error) {
  }
}
async function postProductosMocha(productos){
  try {
    const { data } = await axios.post(url, productos)
/*     console.log("postProductos:")
    console.log(data); */
    return data

  } catch (error) {
  }
}
async function putProductoMocha(id, producto){
  try {
    const { data } = await axios.put(url + id, producto)
/*     console.log("putProducto:")
    console.log(data) */
    return data

  } catch (error) {
  }
}
async function deleteProductosMocha(id){
  try {
    let result
    if (id){
      const { data } = await axios.delete(url + id)
/*       console.log("deleteProducto:")
      console.log(data); */
      result = data
    } else {
      const { data } = await axios.delete(url)
/*       console.log("deleteProductos:")
      console.log(data); */
      result = data
    }
    return result

  } catch (error) {
  }
}

export const cliente = {
  getProductos,
  postProductos,
  putProducto,
  deleteProductos,
}

export const clienteMocha = {
  getProductosMocha,
  postProductosMocha,
  putProductoMocha,
  deleteProductosMocha,
}

export const recursos = {
  modificacion,
  productoAxios,
  variosProds,
  url
}