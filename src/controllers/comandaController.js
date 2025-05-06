import {ComandaInvalida} from "../excepciones/comandas.js";
import * as console from "node:console";

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
      const mesa = req.body.mesa;
      const platos = req.body.platos;
      const comanda = await this.comandaService.crearComanda(mesa, platos)
      res.status(201).json(aComandaRest(comanda))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida) {
        res.status(400).json({
          error: error.message,
        })
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
      if (error instanceof ComandaInvalida) {
        res.status(400).json({
          error: error.message,
        })
      }
    }
  }

  actualizarBebidasComanda(req, res) {
    try {
      const idComanda = parseInt(req.params.id);
      const comanda = this.comandaService.actualizarBebidasComanda(idComanda)
      res.status(200).json(aComandaRest(this.comandaRepository.guardarComanda(idComanda, comanda)))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida) {
        res.status(400).json({
          error: error.message,
        })
      }
    }
  }

  actualizarPlatoComanda(req, res) {
    try {
      const idComanda = parseInt(req.params.id);
      const actualizacionesPlato = req.body;
      const comanda = this.comandaService.actualizarPlatoComanda(idComanda, actualizacionesPlato);
      res.status(200).json(aComandaRest(comanda))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida) {
        res.status(400).json({
          error: error.message,
        })
      }
    }
  }

  buscarComanda(req, res) {
    const bebidasPendientes = req.query.bebidasPendientes && JSON.parse(req.query.bebidasPendientes);
    const platosPendientes = req.query.platosPendientes && JSON.parse(req.query.platosPendientes);
    res.status(200).json(this.comandaRepository.listarPorFlags(platosPendientes, bebidasPendientes).map(aComandaRest))
  }

  async verComanda(req, res) {
    res.status(200).json(aComandaRest(await this.comandaRepository.obtenerPorId(req.params.id)))
  }
}

