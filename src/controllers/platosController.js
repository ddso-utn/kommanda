import {Categoria} from "../domain/categoria.js";
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
    precio: platoRest.precio,
  }
};

export class PlatosController {
  platosService
  menu

  constructor(platosService, menu) {
    this.platosService = platosService;
    this.menu = menu;
  }

  crearPlato(req, res) {
    try {
      const plato = this.platosService.agregarPlato(dePlatoRest(req.body))
      res.status(201).json(aPlatoRest(plato))
    } catch (error) {
      console.error(error)
      if (error instanceof PlatoInvalido) {
        res.status(400).json({ error: error.message })
      }
    }
  }

  verPlatos(req, res) {
    res.status(200).json(this.menu.listar().map(aPlatoRest))
  }

  verPlato(req, res) {
    try {
      res.status(200).json(aPlatoRest(this.menu.obtenerPlatoPorId(parseInt(req.params.id))))
    } catch (error) {
      if (error instanceof PlatoInexistente) {
        res.status(404).json({ error: error.message })
      }
    }
  }

  actualizarPlato(req, res) {
    try {
      const platoId = parseInt(req.params.id);
      const actualizaciones = dePlatoRest(req.body)
      const platoActualizado = this.platosService.actualizarPlato(platoId, actualizaciones)
      res.status(200).json(aPlatoRest(platoActualizado))
    } catch (error) {
      console.error(error)
      if (error instanceof PlatoInvalido) {
        res.status(400).json({ error: error.message })
      } else if (error instanceof PlatoInexistente) {
        res.status(404).json({ error: error.message })
      }
    }
  }

  marcarPlatoDisponible(req, res) {
    try {
      const plato = this.menu.obtenerPlatoPorId(parseInt(req.params.id))
      plato.estaDisponible = req.body.estaDisponible ?? !plato.estaDisponible
      res.status(200).json(aPlatoRest(this.menu.guardarPlato(plato)))
    } catch (error) {
      if (error instanceof PlatoInexistente) {
        res.status(404).json({ error: error.message })
      }
    }
  }
}
