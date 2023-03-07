import * as Logger from "./Logger.js"
import * as db from "./DBs.js"
import * as Faker from "./Faker.js"

// /signin

function getSignin(req,res) {

  res.render("signin")
}

function FileCheck(req, res, next) {
  const file = req.file
  
  if(!file){
    Logger.logConsola.info("No hay ningun archivo recibido")
    return res.redirect("/perfil")
  }
  next()
}

// /login

function getLogin(req, res) {
  if( req.isAuthenticated() ) {
    return res.redirect("/")
  }
  res.render("login")
}

// /logout

function getLogout(req, res) {
  const username = req.user.nombre
  req.session.destroy( err => {
    if(err){
      return res.json({ status: "Logout ERROR", body: err})
    } else {
      res.render("logout", {usuario: username})
    }
  })
}

// "/""

function getIndex(req, res) {

  res.render("index", {user: req.user})
}

// /productos

async function getProductos(req, res) {
  const productos = await db.Products.getAll()
  Logger.logConsola.info("falta catch de promesa getProductos")
  
  let listExists = false
  if (productos.length > 0) {
    listExists = true
  }
  res.render("productos", {user: req.user, productos: productos, listExists})
}

async function postProductos(req, res) {
  const {cant} = req.query

  if(cant <= 0){
    return res.redirect("/productos")
  }
  if(!cant){
    const prodMocks = Faker.getProdMocks()
  } else {
    const prodMocks = Faker.getProdMocks(cant)
  }
    
  await db.Products.saveMany(prodMocks)

  return res.redirect("/productos")
}

// /carrito

async function getCarrito(req, res) {
  let carritoExists = false
  let carrito = {}
  let carritoId = await db.Carros.getCarritoIdByDueño(req.user.email)

  if(carritoId.length > 0){
    carritoExists = true
    carrito = await db.Carros.getById(carritoId)
  } else {
    carritoId = undefined
  }


  res.render("carrito", {user: req.user, carritoExists, carrito, carritoId})
}

// /perfil

function getPerfil(req, res) {
  res.render("perfil", {user: req.user})
}

// /avatarChanger

function postAvatarChange(req, res) {
  res.redirect("/perfil")
}

// /fail

function getFailSignin(req, res) {
  res.render("errorSignin")
}

function getFailLogin(req, res) {
  res.render("errorLogin")
}

export {
  FileCheck,
  getSignin,
  getFailSignin,
  getLogin,
  getFailLogin,
  getLogout,
  getIndex,
  getProductos,
  postProductos,
  getCarrito,
  getPerfil,
  postAvatarChange,
  
  
}