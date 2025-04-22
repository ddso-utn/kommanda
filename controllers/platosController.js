import {Plato} from "../domain/dominio.js";
import {Menu} from "../repositorios/menu.js";

export const PlatosController = {
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

  verPlato(req, res){
    try{
      const idPlato = parseInt(req.params.id)
      if(isNaN(idPlato)){
        res.status(400).json({
          error: "El id debe ser un numero",
        })
      }
      const plato = Menu.obtenerPlato(idPlato)
      res.status(200).json(plato)
    } catch(error){
      res.status(404).json({
        error: error.message,
      })
    }
  }
}