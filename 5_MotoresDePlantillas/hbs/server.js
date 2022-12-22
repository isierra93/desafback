const express = require('express')
const handlebars = require('express-handlebars')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const productos = []
let listExists = false

app.set('views', './views')
app.set('view engine', 'hbs')

app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
  })
)

app.get('/', (req, res)=>{
  res.render('form')
})

app.get('/productos', (req, res)=>{
  if (productos.length > 0) {
    listExists = true
  }
  res.render('productos', {productos, listExists})
})

app.post('/productos' , (req, res)=>{
  productos.push(req.body)
  res.redirect('/')
})

app.listen(8080)