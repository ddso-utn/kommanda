import {Categoria, Plato} from "../domain/dominio.js";
import {Menu} from "../repositorios/menu.js";
import {PlatoInexistente, PlatoInvalido} from "../exceptions/platos.js";

const aPlatoRest = (datosDelPlato) => {
  return {
    id: datosDelPlato.id,
    nombre: datosDelPlato.nombre,
    categoria: datosDelPlato.categoria.nombre.toUpperCase(),
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
      const plato = new Plato(
        dePlatoRest(req.body)
      )
      Menu.agregarPlato(plato)
      res.status(201).json(aPlatoRest(plato))
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
      res.status(200).json(aPlatoRest(plato))
    } catch(error){
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
    res.status(200).json(Menu.todosLosPlatos().map(aPlatoRest))
  },

  actualizarPlato(req, res) {
    try{
      const idPlato = parseInt(req.params.id)
      const plato = Menu.obtenerPlato(idPlato)
      const platoActualizado = new Plato(
        req.body.nombre,
        req.body.categoria,
        req.body.precio
      )
      plato.nombre = platoActualizado.nombre
      plato.categoria = platoActualizado.categoria
      plato.precio = platoActualizado.precio
      res.status(200).json(plato)
    } catch (error){
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
  }
}