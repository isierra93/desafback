const socket = io()

socket.on('mensajes', mensajes => {

  let html = "Aún no hay mensajes previos"

  if ((mensajes.length >= 1)) {
    html = mensajes.map(msj => {
      return `<div>
      <strong style ="color:blue">${msj.author}</strong>
      [<span style ="color:brown">${msj.time}</span>]
      <em style ="color:green">: ${msj.text}</em>
      </div>`
    }).join(" ")
  }  

  document.getElementById("messages").innerHTML = html
})

socket.on('productos', productos => {
  let html = "<p> Aún no hay productos </p>"
  
  if (productos.length >= 1) {
    const prodhtml = productos.map(prod => {
      return `<tr>
      <td>${prod.title}</td>
      <td>${prod.price}</td>
      <td>${prod.thumbnail}</td>
      </tr>`
    }).join(' ')
    html = `
      <table class="table table-dark">
        <tr style="color: yellow;"> <th>Title</th> <th>Price</th> <th>Thumbnail</th> </tr>
        ${prodhtml}
      </table>`
  }
  document.getElementById("productos").innerHTML = html
})

// Funciones para añadir mensajes y productos

function addMessage() {
  const email = document.getElementById("email")
  const text = document.getElementById("texto")
  if (email.value && text.value) {
    const message = {
      author: email.value,
      text: text.value,
      time: new Date().toLocaleString()
    }
    socket.emit('new-msg', message)
  }  
  return false
}
function addProduct() {
  const title = document.getElementById("title")
  const price = document.getElementById("price")
  const thumb = document.getElementById("thumbnail")
  
  if (title.value && price.value && thumb.value) {
    const producto = {
        title: title.value,
        price: price.value,
        thumbnail: thumb.value
    }
  
    socket.emit('new-product', producto)

  }
  return false
}