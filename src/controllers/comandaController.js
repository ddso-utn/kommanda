import {Categoria, Comanda, Plato, PlatoPedido} from "../domain/dominio.js";
import {ComandaRepository} from "../repositories/comandaRepository.js";
import {Menu} from "../repositories/menu.js";
import {PlatoInvalido} from "../excepciones/platos.js";
import {ComandaInvalida} from "../excepciones/comandas.js";
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
      const mesa = req.body.mesa;
      const platos = req.body.platos;
      const comanda = ComandaService.crearComanda(mesa, platos)
      res.status(201).json(aComandaRest(comanda))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida) {
        res.status(400).json({
          error: error.message,
        })
      }
    }
  },

  agregarPlatosComanda(req, res) {
    try {
      const idComanda = parseInt(req.params.id);
      const comanda = ComandaService.agregarPlatoComanda(idComanda, req.body);
      res.status(200).json(aComandaRest(ComandaRepository.guardarComanda(idComanda, comanda)))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida) {
        res.status(400).json({
          error: error.message,
        })
      }
    }
  },

  actualizarBebidasComanda(req, res) {
    try {
      const idComanda = parseInt(req.params.id);
      const comanda = ComandaService.actualizarBebidasComanda(idComanda)
      res.status(200).json(aComandaRest(ComandaRepository.guardarComanda(idComanda, comanda)))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida) {
        res.status(400).json({
          error: error.message,
        })
      }
    }
  },

  actualizarPlatoComanda(req, res) {
    try {
      const idComanda = parseInt(req.params.id);
      const actualizacionesPlato = req.body;
      const comanda = ComandaService.actualizarPlatoComanda(idComanda, actualizacionesPlato);
      res.status(200).json(aComandaRest(comanda))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida) {
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
  },

  verComanda(req, res) {
    res.status(200).json(aComandaRest(ComandaRepository.obtenerPorId(parseInt(req.params.id))))
  }
}

