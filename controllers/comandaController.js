import {Menu, Plato} from "../domain/dominio.js";

export const ComandaController = {
  crearPlato(req, res){
    try{
      const plato = new Plato(
        req.body.nombre,
        req.body.categoria,
        req.body.precio
      )
      Menu.agregarPlato(plato)
      res.status(201).json(plato)
    } catch(error){
      res.status(400).json({
        error: error.message,
      })
    }
  },

  actualizarPlato(req, res){
    try{
      const plato = new Plato(
        req.body.nombre,
        req.body.categoria,
        req.body.precio
      )
      const platoActualizado = Menu.actualizarPlatoPorId(req.params.id, plato)
      res.status(200).json(platoActualizado)
    } catch(error){
      res.status(400).json({
        error: error.message,
      })
    }
  },

  marcarPlatoDisponible(req, res){
    try{
      const plato = Menu.actualizarPlato({estaDisponible: res.disponible})
      res.status(200).json(plato)
    } catch(error){
      res.status(400).json({
        error: error.message,
      })
    }
  },


  verPlatos(req, res) {
    res.status(200).json(Menu.listar())
  }
}

