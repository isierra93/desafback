const socket = io()

// NORMALIZR

const user = new normalizr.schema.Entity('autores',{},{idAttribute: "email"})

const mensaje = new normalizr.schema.Entity('mensajes',{autor: user}, {idAttribute: "id"})

const chatSchema = new normalizr.schema.Entity('chat', {mensajes: [mensaje]},{idAttribute: "id"})

socket.on('mensajes', chatNormalizado => {

  let html = "Aún no hay mensajes previos"

  //descompresion del chatNormalizado
  const chatDenormalizado = normalizr.denormalize(chatNormalizado.result, chatSchema, chatNormalizado.entities)

  if ((chatDenormalizado.mensajes.length >= 1)) {
    html = chatDenormalizado.mensajes.map(msj => {
      return `<div>
      <strong style ="color:blue">${msj.autor.alias}</strong>
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
  const autor = {
    email : document.getElementById("email").value,
    nombre : document.getElementById("nombre").value,
    apellido : document.getElementById("apellido").value,
    edad : document.getElementById("edad").value,
    alias : document.getElementById("alias").value,
    avatar : document.getElementById("avatar").value || ""
  }
  const text = document.getElementById("text").value

  if (autor && text) {
    const message = {
      autor: autor, 
      text: text,
      time: new Date()
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

const descomprimir = dataNormal => denormalize(dataNormal.result, chat, dataNormal.entities)