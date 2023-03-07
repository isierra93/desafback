import mongoose from "mongoose"
import {MONGO_OPTIONS} from "../../config/Options.js"
// import URL from "../../config/urlMongo.js"
import * as logger from "../Logger.js"

class MongoContainer{
  constructor(){
  }

  async connect(){
    try {
      let res = await mongoose.connect(process.env.MONGO_URL, MONGO_OPTIONS)
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