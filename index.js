import express from 'express'
import {startServer} from "./src/app/server.js";
import {connectToDB} from "./src/app/db.js";
import {buildAppContext} from "./src/app/context.js";

const app = express()
const PORT = 3000
const DB_URI = "mongodb://localhost:27017";

const DB_CLIENT = await connectToDB(DB_URI)
const appContext = buildAppContext(DB_CLIENT)

startServer(app, PORT, appContext)
