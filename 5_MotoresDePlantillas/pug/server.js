const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const productos = []
let listExists = false

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req, res)=>{
  res.render('index')
})

app.get('/productos', (req, res)=>{

  if(productos.length > 0)
    listExists = true
  
  res.render('productos', {productos, listExists})
})

app.post('/productos' , (req, res)=>{
  productos.push(req.body)
  res.redirect('/')
})


app.listen(8080)