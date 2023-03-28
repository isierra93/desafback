import {Strategy as LocalStrategy} from "passport-local"
import Usuarios from "../../Persistencia/contenedores/mongohijos/UsuariosDAODb.js"
import Logger from "../../src/Logger.js"
import bCrypt from "bcrypt"

const Users = new Usuarios()

const Login = new LocalStrategy(
  async (username, password, done) => {
    try {
      const acc = await Users.getByEmail(username)
      if(!acc){
        return done(null, false)
      }
      if(!isValidPassword(acc, password)){
        return done(null, false)
      }
      return done(null, acc)
    } catch (error) {
      Logger.logError.error(error)
    }
  })
const Signin = new LocalStrategy(
  async (username, password, done) => {
    try {
    const acc = await Users.getByEmail(username)
    if(acc){
      Logger.logConsola.info("Este usuario ya existe");
      return done(null, false)
    }
    const newAcc = {
      email: username,
      password: createHash(password),
    }
    await Users.save(newAcc)
    return done(null, newAcc)
    } catch (error) {
      Logger.logError.error(error)
    }
})
const Serialize = (username, done) => {
  done(null, username.email)
}
const Deserialize = async (email, done) => {
  const acc = await Users.getByEmail(email)
  done(null, acc)
}

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

export default {
  Login,
  Signin,
  Serialize,
  Deserialize
}