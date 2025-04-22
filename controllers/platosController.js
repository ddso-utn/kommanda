import {Menu, Plato} from "../domain/dominio.js";

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
  }
}