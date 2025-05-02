import express from 'express'
import {startServer} from "./server.js";

const app = express()
const PORT = 3000

startServer(app, PORT)
