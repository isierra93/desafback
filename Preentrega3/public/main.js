const socket = io()

function addMocks() {
  socket.emit("addMocks")
  return false
}

function deleteAllProductos() {
  socket.emit("deleteAllProductos")
  return false
  
}