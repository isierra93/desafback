const socket = io()

console.log("anda main")

function addMocks() {
  console.log("llegó main socket addmocks");
  socket.emit("addMocks")
  return false
}

function deleteAllProductos() {
  console.log("llegó main socket deleteAllProds");
  socket.emit("deleteAllProductos")
  return false
  
}
function addProductoACarrito() {

  console.log("llegó al main.js addprodcarrito");
  /* const data = {
    user,
    productoid: producto._id
  } */
  socket.emit("addProductoACarrito", data)

  return false
}