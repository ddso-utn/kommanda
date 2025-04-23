import {Comanda, PlatoPedido} from "../domain/dominio.js";
import {Menu} from "../repositorios/menu.js";
import {ComandaRepository} from "../repositorios/comandaReposoitory.js";

const deComandaRest = (comandaRest) => {
  //TODO realizar validaciones si corresponde
};

const aComandaRest = (comanda) => {
  return {
    ...comanda,
    platos: comanda.platos.map(p => ({
      nombre: p.plato.nombre,
      cantidad: p.cantidad,
      precio: p.plato.precio,
      notas: p.notas,
      estaListo: p.estaListo,
    })),
    estado: comanda.estado().nombre,
  }
}

export const ComandaController = {
  crearComanda(req, res) {
    const platosPedidos = req.body.platos.map(p =>
      new PlatoPedido(
        Menu.obtenerPlato(p.idPlato),
        p.cantidad,
        p.notas
      )
    )
    const comanda = ComandaRepository.agregarComanda(
      new Comanda(req.body.mesa, platosPedidos)
    )
    res.status(201).json(aComandaRest(comanda));
  }
}