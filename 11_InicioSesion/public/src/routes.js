import {getProdMocks} from "../../public/contenedores/ProdMocks.js"

// GET

export function getSignin(req, res) {
  res.render("signin")
}

export function getLogin(req, res) {
  if(req.isAuthenticated()){
    return res.redirect("/")
  }
  res.render("login")
}

export function getLogout(req, res) {
  const username = req.user.email

  if(!username){
    return res.json( {error: "no hay una session activa"})
  }

  req.session.destroy( err => {
    if(err){
      return res.json({ status: "Logout ERROR", body: err})
    } else {
      res.render("logout", {usuario: username})
    }
  })
}

export async function getAPIProdMocks (req, res) {

  if(req.params.cant){
    const productos = getProdMocks(req.params.cant)
    return res.render("fakerMocks", {productos: productos})
  }
  const productos = getProdMocks()
  res.render("fakerMocks", {productos: productos})
}

export function getAny(req, res) {
  res.redirect("/")
}

export function getFailSignin(req, res) {
  res.render("errorSignin")
}

export function getFailLogin(req, res) {
  res.render("errorLogin")
}

// FUNCTIONS 

