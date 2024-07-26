import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import connectMongo from './db/connectionDB.js'
import router from './expense/router.js'

import { fileURLToPath } from 'url';
import path from 'path'

const app = express()
const port = 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, './client/dist');
console.log(clientPath);
app.use('/', express.static(clientPath))

app.use(express.json())
app.use(cors(
  {
      origin: "http://localhost:5173",
      credentials: "true"
  }
))

const URL = process.env.MONGODB_URL 
const dbName = process.env.DB_NAME 
connectMongo(URL, dbName)

app.use("/api", router)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'./client/dist/index.html'))
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})