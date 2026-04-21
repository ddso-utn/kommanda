import {Comanda} from "../domain/comanda.js";
import {PlatoPedido} from "../domain/platoPedido.js";
import {ComandaRepository} from "../repositories/comandaRepository.js";
import {Menu} from "../repositories/menu.js";
import {ComandaInvalida} from "../excepciones/comandas.js";
import {PlatoInexistente, PlatoInvalido} from "../excepciones/platos.js";

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
      res.status(201).json(comanda)
    } catch (error) {
      console.error(error)
      if (error instanceof ComandaInvalida || error instanceof PlatoInexistente) {
        res.status(400).json({
          error: error.message,
        })
      }
    }
  }
}

