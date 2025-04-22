import bodyParser from "body-parser";
import {PlatosController} from "./src/controllers/platosController.js";
import express from 'express'
import {ComandaController} from "./src/controllers/comandaController.js";
const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/healthCheck', (req, res) => {
  res.status(200).json({mensaje:'Todo marcha bien!'})
})

app.post('/platos', PlatosController.crearPlato)

app.get('/platos', PlatosController.verPlatos)

app.put('/platos/:id', PlatosController.actualizarPlato)

app.patch('/platos/:id', PlatosController.marcarPlatoDisponible)

app.post('/comandas', ComandaController.crearComanda)

app.get('/comandas/:id', ComandaController.verComanda)

app.patch('/comandas/:id', ComandaController.actualizarBebidasComanda)

app.post('/comandas/:id/platos', ComandaController.agregarPlatosComanda)

app.patch('/comandas/:id/platos/:ordenPlato', ComandaController.actualizarPlatoComanda)

app.get('/comandas', ComandaController.buscarComanda)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})