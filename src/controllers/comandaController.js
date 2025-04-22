import {Categoria, Comanda, Menu, Plato} from "../domain/dominio.js";
import {ComandaRepository} from "../repositories/comandaRepository.js";

const aComandaRest = (datosDelPlato) => {
  return {
    id: datosDelPlato.id,
    nombre: datosDelPlato.nombre,
    categoria: datosDelPlato.categoria.nombre,
    precio: datosDelPlato.precio,
    estaDisponible: datosDelPlato.estaDisponible,
  }
};

const deComandaRest = (comandaRest) => {
  //TODO realizar validaciones si corresponde
};

export const ComandaController = {
  crearComanda(req, res){
    try{
      ComandaRepository.agregarComanda(new Comanda())
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

