import {ComandaInexistente, ComandaInvalida} from "../excepciones/comandas.js";
import {PlatoInexistente} from "../excepciones/platos.js";

const aComandaRest = (comanda) => {
  return {
    id: comanda.id,
    mesa: comanda.mesa,
    estado: comanda.estado().nombre,
    bebidasListas: comanda.bebidasListas,
    platos: comanda.platos.map(p => ({
      nombre: p.plato.nombre,
      cantidad: p.cantidad,
      precio: p.plato.precio,
      notas: p.notas,
      estaListo: p.estaListo,
    }))
  }
};

export class ComandaController {
  comandaService
  comandaRepository

  constructor(comandaService, comandaRepository) {
    this.comandaService = comandaService;
    this.comandaRepository = comandaRepository;
  }

  async crearComanda(req, res) {
    try {
      const comanda = await this.comandaService.crearComanda(req.body.mesa, req.body.platos)
      res.status(201).json(aComandaRest(comanda))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida || error instanceof PlatoInexistente) {
        res.status(400).json({ error: error.message })
      }
    }
  }

  async verComanda(req, res) {
    try {
      res.status(200).json(aComandaRest(await this.comandaRepository.obtenerPorId(req.params.id)))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInexistente) {
        res.status(404).json({ error: error.message })
      }
    }
  }

  async agregarPlatosComanda(req, res) {
    try {
      const comanda = await this.comandaService.agregarPlatoComanda(req.params.id, req.body);
      res.status(200).json(aComandaRest(comanda))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida || error instanceof PlatoInexistente) {
        res.status(400).json({ error: error.message })
      }
    }
  }

  async actualizarBebidasComanda(req, res) {
    try {
      const comanda = await this.comandaService.actualizarBebidasComanda(req.params.id, req.body.bebidasListas)
      res.status(200).json(aComandaRest(comanda))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida) {
        res.status(400).json({ error: error.message })
      }
    }
  }

  async actualizarPlatoComanda(req, res) {
    try {
      const comanda = await this.comandaService.actualizarPlatoComanda(req.params.id, req.body, req.params.ordenPlato);
      res.status(200).json(aComandaRest(comanda))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInexistente) {
        res.status(404).json({ error: error.message })
      }
      if (error instanceof ComandaInvalida || error instanceof PlatoInexistente) {
        res.status(400).json({ error: error.message })
      }
    }
  }

  async buscarComanda(req, res) {
    const bebidasPendientes = req.query.bebidasPendientes && JSON.parse(req.query.bebidasPendientes);
    const platosPendientes = req.query.platosPendientes && JSON.parse(req.query.platosPendientes);
    res.status(200).json((await this.comandaRepository.listarPorFlags(platosPendientes, bebidasPendientes)).map(aComandaRest))
  }
}
