import bodyParser from "body-parser";
import {PlatosController} from "./src/controllers/platosController.js";
import express from 'express'
import {ComandaController} from "./src/controllers/comandaController.js";
const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/platos', PlatosController.crearPlato)

app.get('/platos', PlatosController.verPlatos)

app.put('/platos/:id', PlatosController.actualizarPlato)

app.patch('/platos/:id', PlatosController.marcarPlatoDisponible)

app.post('/comandas', ComandaController.crearComanda)

app.patch('/comandas/:id/platos/:ordenPlato', (req, res) => {
  const body = {
    cantidad: 3,
    notas: "Sin tomate"
  }
})

app.get('/comandas/:id', ComandaController.verComanda)

// app.get('/comandas/:id?platosPendientes=:platosPendientes&bebidasPendientes=:bebidasPendientes', (req, res) => {
//   const returns = [{
//     mesa: 1,
//     estado: "INGRESADA",
//     platos: [{
//       idPlato: 12,
//       cantidad: 1,
//       notas: "Sin cebolla"
//     }],
//   }]
// })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})