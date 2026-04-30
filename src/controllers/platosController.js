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

  async crearPlato(req, res) {
    try {
      const plato = await this.platosService.agregarPlato(dePlatoRest(req.body))
      res.status(201).json(aPlatoRest(plato))
    } catch (error) {
      console.error(error)
      if (error instanceof PlatoInvalido) {
        res.status(400).json({ error: error.message })
      }
    }
  }

  async verPlatos(req, res) {
    res.status(200).json((await this.menu.listar()).map(aPlatoRest))
  }

  async verPlato(req, res) {
    try {
      res.status(200).json(aPlatoRest(await this.menu.obtenerPlatoPorId(req.params.id)))
    } catch (error) {
      if (error instanceof PlatoInexistente) {
        res.status(404).json({ error: error.message })
      }
    }
  }

  async actualizarPlato(req, res) {
    try {
      const platoActualizado = await this.platosService.actualizarPlato(req.params.id, dePlatoRest(req.body))
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

  async marcarPlatoDisponible(req, res) {
    try {
      const plato = await this.menu.obtenerPlatoPorId(req.params.id)
      plato.estaDisponible = req.body.estaDisponible ?? !plato.estaDisponible
      res.status(200).json(aPlatoRest(await this.menu.guardarPlato(plato)))
    } catch (error) {
      if (error instanceof PlatoInexistente) {
        res.status(404).json({ error: error.message })
      }
    }
  }
}
