import mongoose from "mongoose"
import URL from "../../config/urlMongo.js"
import * as logger from "../src/logger.js"

class MongoContainer{
  constructor(){
  }

  async connect(){
    try {
      let res = await mongoose.connect(URL, {
        useNewUrlParser: true,
        UseUnifiedTopology: true
      })
    } catch (err) {
      logger.logError.error(err)
    }
  }

  async disconnect(){
    try {
      await mongoose.disconnect()
    } catch (err) {
      logger.logError.error(err)
    }
  }
}

export default MongoContainer