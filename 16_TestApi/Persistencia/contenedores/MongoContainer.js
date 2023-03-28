import mongoose from "mongoose"
import MONGO_URL from "../../config/mongoURL.js"
import Logger from "../../src/logger.js"

class MongoContainer{
  constructor(){
  }

  async connect(){
    try {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        UseUnifiedTopology: true
      })

    } catch (err) {
      Logger.logError.error(err)
    }
  }

  async disconnect(){
    try {
      await mongoose.disconnect()
    } catch (err) {
      Logger.logError.error(err)
    }
  }
}

export default MongoContainer