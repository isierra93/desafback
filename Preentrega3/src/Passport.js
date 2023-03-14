import bCrypt from "bcrypt"
import {Strategy as LocalStrategy} from "passport-local"
import * as db from "./DBs.js"
import * as Logger from "./Logger.js"

const Login = new LocalStrategy(
  async (username, password, next) => {
  try {
    const user = await db.Users.getByEmail(username)

    if(!user){
      return next(null, false)
    }

    if(!isValidPassword(user, password)){
      return next(null, false)
    }

    return next(null, user)
  } catch (error) {
    Logger.logError.error(error)
  }
  })
  
const Signin =  new LocalStrategy( {
  passReqToCallback: true}, 
  async (req, username, password, next) => {
    try {
    const user = await db.Users.getByEmail(req.body.email)

    if(user){
      return next(null, false)
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
      return next(null, newUser)
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
  return next(null, newUser)  
    } catch (error) {
      Logger.logError.error(error)
    }
    
  })

const Serializar = (username, next) => {
  next(null, username.email)
}

const Deserializar = async (email, next) => {
  try {
    const acc = await db.Users.getByEmail(email)

    next(null, acc)
  } catch (error) {
    Logger.logError.error(error)
    
  }

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