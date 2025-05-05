import express from 'express'
import {startServer} from "./server.js";
import {connectToDB} from "./db.js";

const app = express()
const PORT = 3000
const DB_URI = "mongodb://localhost:27017";

export const DB_CLIENT = await connectToDB(DB_URI)

startServer(app, PORT)

