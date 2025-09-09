import {Comanda, PlatoPedido} from "../domain/dominio.js";
import {ComandaRepository} from "../repositories/comandaRepository.js";
import {Menu} from "../repositories/menu.js";
import {ComandaInexistente, ComandaInvalida} from "../excepciones/comandas.js";
import {PlatoInexistente, PlatoInvalido} from "../excepciones/platos.js";
import {ComandaService} from "../services/comandaService.js";

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

export const ComandaController = {

  crearComanda(req, res) {
    try {
      const comanda = ComandaService.crearComanda(req.body.mesa,req.body.platos)
      res.status(201).json(aComandaRest(comanda))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida || error instanceof PlatoInexistente) {
        res.status(400).json({
          error: error.message,
        })
      }
    }
  },

  verComanda(req, res) {
    try {
      res.status(200).json(aComandaRest(ComandaRepository.obtenerPorId(parseInt(req.params.id))))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInexistente) {
        res.status(404).json({
          error: error.message,
        })
      }
    }
  },

  actualizarPlatoComanda(req, res) {
    try {
      const ordenPlato = req.params.ordenPlato;
      const idComanda = parseInt(req.params.id);
      const actualizacionesPlato = req.body;
      res.status(200).json(aComandaRest(ComandaService.actualizarPlatoComanda(idComanda,actualizacionesPlato,ordenPlato)))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInexistente) {
        res.status(404).json({
          error: error.message,
        })
      }
      if (error instanceof ComandaInvalida || error instanceof PlatoInexistente) {
        res.status(400).json({
          error: error.message,
        })
      }
    }
  },

  buscarComanda(req, res) {
    const bebidasPendientes = req.query.bebidasPendientes && JSON.parse(req.query.bebidasPendientes);
    const platosPendientes = req.query.platosPendientes && JSON.parse(req.query.platosPendientes);
    res.status(200).json(ComandaRepository.listarPorFlags(platosPendientes, bebidasPendientes).map(aComandaRest))
  }
}

