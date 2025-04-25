import {Categoria, Plato} from "../domain/dominio.js";
import {Menu} from "../repositories/menu.js";
import {PlatoInexistente, PlatoInvalido} from "../excepciones/platos.js";
import {PlatosService} from "../services/platosService.js";

const aPlatoRest = (datosDelPlato) => {
  return {
    id: datosDelPlato.id,
    nombre: datosDelPlato.nombre,
    categoria: datosDelPlato.categoria.nombre,
    precio: datosDelPlato.precio,
    estaDisponible: datosDelPlato.estaDisponible,
  }
};

const dePlatoRest = (platoRest) => {
  //TODO realizar validaciones si corresponde
  return {
    nombre: platoRest.nombre,
    categoria: platoRest.categoria && Categoria.fromString(platoRest.categoria),
    precio: platoRest.precio,
    estaDisponible: platoRest.disponible,
  }
};


export const PlatosController = {

  crearPlato(req, res){
    try{
      const plato = PlatosService.agregarPlato(dePlatoRest(req.body))
      res.status(201).json(aPlatoRest(plato))
    } catch(error){
      console.error(error)
      if(error instanceof PlatoInvalido){
        res.status(400).json({
          error: error.message,
        })
      }
    }
  },

  actualizarPlato(req, res){
    try{
      const platoId = parseInt(req.params.id);
      const actualizaciones = dePlatoRest(req.body)
      const platoActualizado = PlatosService.actualizarPlato(platoId, actualizaciones)
      res.status(200).json(aPlatoRest(platoActualizado))
    } catch(error){
      console.error(error)
      if(error instanceof PlatoInvalido){
        res.status(400).json({
          error: error.message,
        })
      } else if(error instanceof PlatoInexistente){
        res.status(404).json({
          error: error.message,
        })
      }
    }
  },

  marcarPlatoDisponible(req, res){
    try{
      const plato = Menu.guardarPlato(parseInt(req.params.id), dePlatoRest(req.body))
      res.status(200).json(aPlatoRest(plato))
    } catch(error){
      console.error(error)
      if(error instanceof PlatoInvalido){
        res.status(400).json({
          error: error.message,
        })
      } else if(error instanceof PlatoInexistente){
        res.status(404).json({
          error: error.message,
        })
      }
    }
  },

  verPlatos(req, res) {
    res.status(200).json(Menu.listar().map(aPlatoRest))
  }
}

