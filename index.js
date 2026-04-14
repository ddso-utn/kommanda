import bodyParser from "body-parser";
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'fs'
import { parse } from 'yaml'

const app = express()
const port = 3000
const spec = parse(readFileSync('./docs.yaml', 'utf-8'))

app.use(bodyParser.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))

app.get('/healthCheck', (req, res) => {
  res.status(200).json({mensaje:'Todo marcha bien!'})
})

app.post('/platos', (req, res) => {
  res.status(201).json({ id: 1, nombre: "Milanesa con puré", precio: 10000, categoria: "PRINCIPAL", estaDisponible: true })
})

app.get('/platos', (req, res) => {
  res.status(200).json([
    { id: 1, nombre: "Milanesa con puré", precio: 10000, categoria: "PRINCIPAL", estaDisponible: true },
    { id: 2, nombre: "Ensalada César", precio: 7000, categoria: "ENTRADA", estaDisponible: true },
    { id: 3, nombre: "Flan casero", precio: 4000, categoria: "POSTRE", estaDisponible: false }
  ])
})

app.get('/platos/:id', (req, res) => {
  res.status(200).json({ id: 1, nombre: "Milanesa con puré", precio: 10000, categoria: "PRINCIPAL", estaDisponible: true })
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
