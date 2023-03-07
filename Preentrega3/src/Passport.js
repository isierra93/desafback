import bCrypt from "bcrypt"
import {Strategy as LocalStrategy} from "passport-local"
import * as db from "./DBs.js"

const Login = new LocalStrategy( async (username, password, done) => {
    const user = await db.Users.getByEmail(username)

    if(!user){
      return done(null, false)
    }

    if(!isValidPassword(user, password)){
      return done(null, false)
    }

    return done(null, user)
  })
  
const Signin =  new LocalStrategy( {
  passReqToCallback: true}, 
  async (req, username, password, done) => {
    const user = await db.Users.getByEmail(req.body.email)

    if(user){
      return done(null, false)
    }
    const { email, apellido, edad , direccion, phone} = req.body
    const { file } = req
    if(file){
      const newUser = {
        email,
        password: createHash(password),
        nombre: username,
        apellido,
        edad,
        direccion,
        numero: phone,
        avatar: file.filename
      }
      await db.Users.save(newUser)
      return done(null, newUser)
  }

  const newUser = {
    email,
    password: createHash(password),
    nombre: username,
    apellido,
    edad,
    direccion,
    numero: phone,
    avatar: "sinFoto.jpg"
  }
  await db.Users.save(newUser)
  return done(null, newUser)
  })

const Serializar = (username, done) => {
  done(null, username.email)
}

const Deserializar = async (email, done) => {
  const acc = await db.Users.getByEmail(email)
  
  done(null, acc)
}

// functions

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password)
}

function createHash(password) {
  return bCrypt.hashSync(
    password,
    bCrypt.genSaltSync(10),
    null
  )
}


export {
  Login,
  Signin,
  Serializar,
  Deserializar
}