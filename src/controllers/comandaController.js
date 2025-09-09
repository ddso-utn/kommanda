import {Comanda, PlatoPedido} from "../domain/dominio.js";
import {ComandaRepository} from "../repositories/comandaRepository.js";
import {Menu} from "../repositories/menu.js";
import {ComandaInexistente, ComandaInvalida} from "../excepciones/comandas.js";
import {PlatoInexistente, PlatoInvalido} from "../excepciones/platos.js";

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
      const platosPedidos = req.body.platos.map(p =>
        new PlatoPedido(
          Menu.obtenerPlatoPorId(p.idPlato),
          p.cantidad,
          p.notas
        )
      );
      const comanda = ComandaRepository.agregarComanda(new Comanda(mesa, platosPedidos))
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
      const idComanda = parseInt(req.params.id);
      const comanda = ComandaRepository.obtenerPorId(idComanda);
      const actualizacionesPlato = req.body;
      const ordenPlato = req.params.ordenPlato;
      if(actualizacionesPlato.notas) {
        comanda.agregarNotas(ordenPlato, actualizacionesPlato.notas)
      }
      if(actualizacionesPlato.cantidad){
        comanda.asignarCantidad(ordenPlato, actualizacionesPlato.cantidad)
      }
      if(actualizacionesPlato.estaListo){
        comanda.marcarListo(ordenPlato, actualizacionesPlato.estaListo)
      }
      res.status(200).json(ComandaRepository.guardarComanda(idComanda, comanda))
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida) {
        res.status(400).json({
          error: error.message,
        })
      }
    }
  },
}

