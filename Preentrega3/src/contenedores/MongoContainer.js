import mongoose from "mongoose"
import {MONGO_OPTIONS} from "../config/mongoOptions.js"
import {MONGO_URL} from "../config/mongoUrl.js"
import * as logger from "../Logger.js"

class MongoContainer{
  constructor(){
  }

  async connect(){
    try {
      let res = await mongoose.connect(process.env.MONGO_URL || MONGO_URL, MONGO_OPTIONS)
    } catch (error) {
      logger.logError.error(error)
    }
  }

  async disconnect(){
    try {
      await mongoose.disconnect()
    } catch (error) {
      logger.logError.error(error)
    }
  }
}

export default MongoContainer