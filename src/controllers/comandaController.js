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

  crearComanda(req, res) {
    try {
      const comanda = this.comandaService.crearComanda(req.body.mesa, req.body.platos)
      res.status(201).json(aComandaRest(comanda))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida || error instanceof PlatoInexistente) {
        res.status(400).json({ error: error.message })
      }
    }
  }

  verComanda(req, res) {
    try {
      res.status(200).json(aComandaRest(this.comandaRepository.obtenerPorId(parseInt(req.params.id))))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInexistente) {
        res.status(404).json({ error: error.message })
      }
    }
  }

  agregarPlatosComanda(req, res) {
    try {
      const idComanda = parseInt(req.params.id);
      const comanda = this.comandaService.agregarPlatoComanda(idComanda, req.body);
      res.status(200).json(aComandaRest(this.comandaRepository.guardarComanda(idComanda, comanda)))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida || error instanceof PlatoInexistente) {
        res.status(400).json({ error: error.message })
      }
    }
  }

  actualizarBebidasComanda(req, res) {
    try {
      const idComanda = parseInt(req.params.id);
      const comanda = this.comandaService.actualizarBebidasComanda(idComanda, req.body.bebidasListas)
      res.status(200).json(aComandaRest(this.comandaRepository.guardarComanda(idComanda, comanda)))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida) {
        res.status(400).json({ error: error.message })
      }
    }
  }

  actualizarPlatoComanda(req, res) {
    try {
      const idComanda = parseInt(req.params.id);
      const ordenPlato = req.params.ordenPlato;
      const actualizacionesPlato = req.body;
      const comanda = this.comandaService.actualizarPlatoComanda(idComanda, actualizacionesPlato, ordenPlato);
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

  buscarComanda(req, res) {
    const bebidasPendientes = req.query.bebidasPendientes && JSON.parse(req.query.bebidasPendientes);
    const platosPendientes = req.query.platosPendientes && JSON.parse(req.query.platosPendientes);
    res.status(200).json(this.comandaRepository.listarPorFlags(platosPendientes, bebidasPendientes).map(aComandaRest))
  }
}
