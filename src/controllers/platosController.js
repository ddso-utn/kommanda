import {Categoria, Plato} from "../domain/dominio.js";
import {Menu} from "../repositories/menu.js";
import {PlatoInexistente, PlatoInvalido} from "../excepciones/platos.js";

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
  return {
    nombre: platoRest.nombre,
    categoria: platoRest.categoria && Categoria.fromString(platoRest.categoria),
    precio: platoRest.precio
  }
};

export const PlatosController = {

  crearPlato(req, res){
    try{
      const plato = Menu.agregarPlato(new Plato(dePlatoRest(req.body)))
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

  verPlatos(req, res) {
    res.status(200).json(Menu.listar().map(aPlatoRest))
  },

  verPlato(req, res) {
    try{
      res.status(200).json(aPlatoRest(Menu.obtenerPlatoPorId(parseInt(req.params.id))))
    } catch (error) {
      if(error instanceof PlatoInexistente){
        res.status(404).json({
          error: error.message,
        })
      }
    }
  },

  actualizarPlato(req, res){
    try{
      const platoId = parseInt(req.params.id);
      const actualizaciones = dePlatoRest(req.body)
      Plato.validarParametros(actualizaciones)
      const platoActualizado =  Menu.obtenerPlatoPorId(platoId)
      platoActualizado.nombre = actualizaciones.nombre
      platoActualizado.categoria = actualizaciones.categoria
      platoActualizado.precio = actualizaciones.precio
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
}

