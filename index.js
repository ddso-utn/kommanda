import bodyParser from "express";
import {Plato, Menu} from "./domain/dominio.js";
import {PlatosController} from "./controllers/platosController.js";
import express from 'express'
const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/platos', PlatosController.crearPlato)

app.put('/platos/:id', (req, res) => {
  const body = {
    nombre: "Milanesa con puré de papas",
    categoria: "PRINCIPAL",
    precio: 17000
  }
})

app.patch('/platos/:id', (req, res) => {
  const body = {
    disponible: false
  }
})

app.post('/comandas', (req, res) => {
  const body = {
    mesa: 1,
    platos: [{
      idPlato: 12,
      cantidad: 1,
      notas: "Sin cebolla"
    }],
  }
})

app.patch('/comandas/:id', (req, res) => {
  const body = [
    {
      idPlato: 22,
      operacion: "ELIMINAR",
      cantidad: 2
    },
    {
      idPlato: 2,
      operacion: "AGREGAR",
      cantidad: 1
    }
  ]
})


app.post('/comandas/:id/platos', (req, res) => {
  const body = {
    idPlato: 22,
    cantidad: 2
  }
})

app.patch('/comandas/:id/platos/:ordenPlato', (req, res) => {
  const body = {
    cantidad: 3,
    notas: "Sin tomate"
  }
})

app.delete('/comandas/:id/platos/:ordenPlato', (req, res) => {
})

app.get('/comandas/:id', (req, res) => {
  const returns = {
    mesa: 1,
    estado: "INGRESADA",
    bebidasListas: false,
    platos: [{
      idPlato: 12,
      cantidad: 1,
      notas: "Sin cebolla"
    }],
  }
})

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

app.patch('/comandas/:id/platos/:ordenPlato', (req, res) => {
  const body = {
    estaListo: true,
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})