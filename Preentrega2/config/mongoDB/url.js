import mongoose from "mongoose"

const URL ="mongodb://localhost:27017/ecommerce"

const connect = mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

export * from "url.js";
