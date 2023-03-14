import Twilio from "twilio"
import twilioAuth from "./config/twilioAuth.js"

const accountSid = twilioAuth.TWILIO_ACCOUNT_SID
const authToken = twilioAuth.TWILIO_AUTH_TOKEN
const client = Twilio(accountSid, authToken)

export default client.messages
