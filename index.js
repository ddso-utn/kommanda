const bodyParser = require("express")
const express = require('express')
const {Plato} = require("./domain/dominio");
const app = express()
const port = 3000

class RepoPlatos {
  platos = []

  guardarPlato(plato){
    plato.id = this.platos.length + 1
    this.platos.push(plato)
    return plato;
  }

  buscarPorId(id){
    return this.platos.find(p => p.id === id)
  }

  listar(){
    return this.platos
  }
}

const Menu =  new RepoPlatos()

app.use(bodyParser.json())

//Crear un plato
//POST /platos
app.post('/platos', (req, res) => {
  const nuevoPlato = new Plato({
    nombre: req.body.nombre,
    categoria: req.body.categoria,
    precio: req.body.precio,
  })
  const platoGuardado = Menu.guardarPlato(nuevoPlato)
  res.status(201).json(platoGuardado)
})

//Ver todos los platos
app.get('/platos', (req, res) => {
  // Response
  // 200
  //[{
  //     "nombre": "Ravioles con bolognesa",
  //     "precio": 10000,
  //     "categoria": "PRINCIPAL"
  // },
  // {
  //     "nombre": "Ravioles con bolognesa",
  //     "precio": 10000,
  //     "categoria": "PRINCIPAL"
  // }]
})

//Ver un plato
app.get('/platos/:id', (req, res) => {
  // Response
  // 200
  //{
  //     "nombre": "Ravioles con bolognesa",
  //     "precio": 10000,
  //     "categoria": "PRINCIPAL"
  // }
})

//Modificar un plato
app.put('/platos/:id', (req, res) => {
  //Body
  //{
  //     "id": 1,
  //     "nombre": "Ravioles con bolognesa",
  //     "precio": 10000,
  //     "categoria": "PRINCIPAL"
  // }
  //Response 200
  //{
  //     "id": 1,
  //     "nombre": "Ravioles con bolognesa",
  //     "precio": 10000,
  //     "categoria": "PRINCIPAL"
  // } (Opcional)
})


//Marcar un plato como no disp.
app.patch('/platos/:id', (req, res) => {
  //Body
  //{
  //     "estaDisponible": false
  // }
  // Response 200
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})