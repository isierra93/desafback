import admin from "firebase-admin"
import fs from "fs"

const serviceAccount = JSON.parse(fs.readFileSync("./preentrega2-54008-firebase-adminsdk-x9yhh-861b6f5e36.json"))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

export * from "firestoreConfig.js";
