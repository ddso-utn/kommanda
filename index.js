import bodyParser from "body-parser";
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'fs'
import { parse } from 'yaml'
import {Plato} from "./src/domain/plato.js";
import {Menu} from "./src/repositories/menu.js";
import {PlatoInvalido, PlatoInexistente} from "./src/excepciones/platos.js";

const app = express()
const port = 3000
const spec = parse(readFileSync('./docs.yaml', 'utf-8'))

app.use(bodyParser.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))

app.get('/healthCheck', (req, res) => {
  res.status(200).json({mensaje:'Todo marcha bien!'})
})

app.post('/platos', (req, res) => {
  try {
    const plato = Menu.agregarPlato(new Plato(req.body))
    res.status(201).json(plato)
  } catch(error) {
    if(error instanceof PlatoInvalido) {
      res.status(400).json({ error: error.message })
    }
  }
})

app.get('/platos', (req, res) => {
  res.status(200).json(Menu.listar())
})

app.get('/platos/:id', (req, res) => {
  try {
    res.status(200).json(Menu.obtenerPlatoPorId(parseInt(req.params.id)))
  } catch(error) {
    if(error instanceof PlatoInexistente) {
      res.status(404).json({ error: error.message })
    }
  }
})

app.put('/platos/:id', (req, res) => {
  res.status(200).json({ id: 1, nombre: "Milanesa con puré", precio: 10000, categoria: "PRINCIPAL", estaDisponible: true })
})

app.patch('/platos/:id', (req, res) => {
  res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
