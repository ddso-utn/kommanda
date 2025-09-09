import bodyParser from "body-parser";
import {PlatosController} from "./src/controllers/platosController.js";
import express from 'express'
const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/healthCheck', (req, res) => {
  res.status(200).json({mensaje:'Todo marcha bien!'})
})

app.post('/platos', PlatosController.crearPlato)

app.get('/platos', PlatosController.verPlatos)

app.get('/platos/:id', PlatosController.verPlato)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})