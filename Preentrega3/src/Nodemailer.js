import { createTransport } from "nodemailer";
import user from "./config/nodemailerEmail.js"

const pass = "avcqqfxpbhxtsvfw"

const authentication = {
  user,
  pass
}

const ecommerceGmail = createTransport({
  service : "gmail",
  port : 586,
  auth : authentication,

})

export {
  ecommerceGmail,
}