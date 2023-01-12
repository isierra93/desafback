import mongoose from "mongoose"
import URL from "../../config/urlMongo.js"

class MongoContainer{
  constructor(){
  }

  async connect(){
    try {
      let res = await mongoose.connect(URL, {
        useNewUrlParser: true,
        UseUnifiedTopology: true
      })
      console.log("DB conectada")
    } catch (error) {
      console.log(error)
    }
  }

  async disconnect(){
    try {
      await mongoose.disconnect()
      console.log("desconectada")
    } catch (error) {
      console.log(error)
    }
  }
}

export default MongoContainer