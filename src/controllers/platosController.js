import {Plato} from "../domain/plato.js";
import {Menu} from "../repositories/menu.js";
import {PlatoInexistente, PlatoInvalido} from "../excepciones/platos.js";

export const PlatosController = {

  crearPlato(req, res){
    try{
      const plato = Menu.agregarPlato(new Plato(req.body))
      res.status(201).json(plato)
    } catch(error){
      console.error(error)
      if(error instanceof PlatoInvalido){
        res.status(400).json({
          error: error.message,
        })
      }
    }
  },

  verPlatos(req, res) {
    res.status(200).json(Menu.listar())
  },

  verPlato(req, res) {
    try{
      res.status(200).json(Menu.obtenerPlatoPorId(parseInt(req.params.id)))
    } catch (error) {
      if(error instanceof PlatoInexistente){
        res.status(404).json({
          error: error.message,
        })
      }
    }
  }
}
