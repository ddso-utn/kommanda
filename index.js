const express = require('express')
const app = express()
const port = 3000

app.post('/platos', (req, res) => {
  const requestBody = {
    nombre: "Milanesa con Puré",
    precio: 10000,
    categoria: "PRINCIPAL"
  }

  const responseBody = {
    id: 1,
    nombre: "Milanesa con Puré",
    precio: 10000,
    categoria: "PRINCIPAL"
  }

  res.status(201).json(responseBody)
})

app.put('/platos/:idPlato', (req, res) => {
  const requestBody = {
    nombre: "Milanesa con Papas",
    precio: 14000,
    categoria: "PRINCIPAL"
  }

  const responseBody = {
    id: 1,
    nombre: "Milanesa con Papas",
    precio: 14000,
    categoria: "PRINCIPAL"
  }

  res.status(200).json(responseBody)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})