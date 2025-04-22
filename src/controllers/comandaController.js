import {Categoria, Comanda, Plato, PlatoPedido} from "../domain/dominio.js";
import {ComandaRepository} from "../repositories/comandaRepository.js";
import {Menu} from "../repositories/menu.js";
import {PlatoInvalido} from "../excepciones/platos.js";
import {ComandaInvalida} from "../excepciones/comandas.js";

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

const deComandaRest = (comandaRest) => {
  //TODO realizar validaciones si corresponde
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
      const comanda = ComandaRepository.obtenerPorId(idComanda);
      const datosPlato = req.body;
      const nuevoPlato = new PlatoPedido(
        Menu.obtenerPlatoPorId(datosPlato.idPlato),
        datosPlato.cantidad,
        datosPlato.notas
      )
      comanda.agregarPlato(nuevoPlato)
      res.status(200).json(aComandaRest(ComandaRepository.actualizarComanda(idComanda, comanda)))
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
      const comanda = ComandaRepository.obtenerPorId(idComanda);
      comanda.marcarBebidasListas(req.body.bebidasListas)
      res.status(200).json(aComandaRest(ComandaRepository.actualizarComanda(idComanda, comanda)))
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
      res.status(200).json(aComandaRest(ComandaRepository.actualizarComanda(idComanda, comanda)))
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

