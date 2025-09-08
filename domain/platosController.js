import {Menu} from "../repositorios/menu.js";

class PlatosController {

  crearPlato (req, res){
    try{
      const nuevoPlato = new Plato({
        nombre: req.body.nombre,
        categoria: req.body.categoria,
        precio: req.body.precio,
      })
      const platoGuardado = Menu.guardarPlato(nuevoPlato)
      res.status(201).json(platoGuardado)
    } catch(err){
      res.status(400).json({
        "error": err.message,
      })
    }
  };

  verTodosLosPlatos(req, res){
    res.status(200).json(Menu.listar())
  };

 verPlatoPorID (req, res){
    const idPlato = parseInt(req.params.id)
    const plato = Menu.buscarPorId(idPlato)
    if(plato){
      res.status(200).json(plato)
    } else {
      res.sendStatus(404)
    }
  };
}