import {Categoria, Plato} from "../domain/dominio.js";
import {Menu} from "../repositories/menu.js";
import {PlatoInexistente, PlatoInvalido} from "../excepciones/excepciones.js";

const comoPlatoAMostrar = (plato) => {
  return {
    id: plato.id,
    nombre: plato.nombre,
    categoria: plato.categoria.nombre,
    precio: plato.precio,
    estaDisponible: plato.estaDisponible,
  }
};

const deParametrosDePlatoCompleto = (parametros) => {
  return new Plato({
    nombre: parametros.nombre,
    categoria: Categoria.fromString(parametros.categoria),
    precio: parametros.precio,
  })
};

const deParametrosActualizaciónParcialDePlato = (parametros) => {
  //TODO realizar validaciones
  return {
    nombre: parametros.nombre,
    categoria: parametros.categoria && Categoria.fromString(parametros.categoria),
    precio: parametros.precio,
    estaDisponible: parametros.disponible,
  }
};


export const PlatosController = {
  crearPlato(req, res){
    try{
      const plato = deParametrosDePlatoCompleto(req.body)
      Menu.agregarPlato(plato)
      res.status(201).json(comoPlatoAMostrar(plato))
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
      const plato = deParametrosDePlatoCompleto(req.body)
      const platoActualizado = Menu.actualizarPlatoPorId(parseInt(req.params.id), plato)
      res.status(200).json(comoPlatoAMostrar(platoActualizado))
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
      const plato = Menu.actualizarPlatoPorId(parseInt(req.params.id), deParametrosActualizaciónParcialDePlato(req.body))
      res.status(200).json(comoPlatoAMostrar(plato))
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
    res.status(200).json(Menu.listar().map(comoPlatoAMostrar))
  }
}

