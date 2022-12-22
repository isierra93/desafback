const express = require('express')
const {Router} = express

const app = express()
const PORT = 8080

const router = new Router()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/', express.static(__dirname+'/public'))
app.use('/api/productos', router)

const productos = []

/////// Middlewares

function addId( req, res, next){

  let idNum
  /* Primer producto id = 1 */
  if (productos.length == 0) {
    idNum = 1
  }
  /* suma uno al ultimo id*/
  else {
    idNum = productos[productos.length - 1].id + 1
  }
  /*Añado id*/
  req.body.id = idNum
  next()
}
function getById(req, res, next){
  const {id} = req.params
  /* Si no hay productos */
  if(productos.length == 0){
    return res.json({ error:'producto no encontrado'})
  }
  /* Bucle buscando ids iguales y guardo el producto en req*/
  let i = 0
  while (i < id && i < productos.length) {
    if (productos[i].id == id) {
      req.prod = productos[i]
      return next()
    }
    i++
  }
  /* Si sale del bucle sin disparar next() */
  return res.json({ error:'producto no encontrado'})
}
function deleteWithId(req, res, next){
  /* Ya asumo haber encontrado una id así que no controlo ese error */
  
  /* Bucle buscando ids iguales y eliminar un elemento del array en pos i encontrada */
  let i = 0
  while (i < req.prod.id && i <= productos.length) {
    if (productos[i].id == req.prod.id) {
      productos.splice(i, 1)
    }
    i++
  }
  next()
}
function putById(req, res, next){
  const {id} = req.params
  const prodNew = req.body
  /* Si no hay productos */
  if(productos.length == 0){
    return res.json({ error:'producto no encontrado'})
  }
  /* Bucle buscando ids iguales y si encuentra actualizo atributos del producto en i*/
  let i = 0
  while (i != id && i <= productos.length) {
    if (productos[i].id == id) {
      productos[i].title = prodNew.title
      productos[i].price = prodNew.price
      productos[i].thumbnail = prodNew.thumbnail
      next()
    }
    i++
  }
  /* Si sale del bucle sin ejecutar next() */
  return res.json({ error:'producto no encontrado'})
}
//GET
router.get('/', (req, res) => {
  res.json(productos)
})
router.get('/:id', getById, (req, res) => {
  res.json(req.prod)
})
//POST
router.post('/', addId, (req, res) => {
  const prod = req.body
  productos.push(prod)
  res.json(prod)
})
//PUT
router.put('/:id', putById, (req, res) => {
  res.json({Producto: `Actualizado id:${req.params.id}`})
})
//DELETE
router.delete('/:id', getById, deleteWithId, (req, res) => {
  res.json({Producto: `Eliminado id:${req.params.id}`})
})

// <|_SERVER_|>
const server = app.listen(PORT,()=>{
  console.log(`Server escuchando correctamente desde puerto ${PORT}`)
})
server.on('error', err => {console.log(err)})

