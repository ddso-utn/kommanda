import {ComandaRepository} from "../repositories/comandaRepository.js";
import {Comanda, PlatoPedido} from "../domain/dominio.js";
import {Menu} from "../repositories/menu.js";

export const ComandaService = {

  crearComanda(mesa, platos) {
    const platosPedidos = platos.map(p =>
      new PlatoPedido(
        Menu.obtenerPlatoPorId(p.idPlato),
        p.cantidad,
        p.notas
      )
    );
    return ComandaRepository.agregarComanda(new Comanda(mesa, platosPedidos))
  },

  agregarPlatoComanda(idComanda, datosPlato) {
    const comanda = ComandaRepository.obtenerPorId(idComanda);
    const nuevoPlato = new PlatoPedido(
      Menu.obtenerPlatoPorId(datosPlato.idPlato),
      datosPlato.cantidad,
      datosPlato.notas
    )
    comanda.agregarPlato(nuevoPlato)
    return comanda;
  },

  actualizarBebidasComanda(idComanda){
    const comanda = ComandaRepository.obtenerPorId(idComanda);
    comanda.marcarBebidasListas(req.body.bebidasListas)
    return comanda;
  },

  actualizarPlatoComanda(idComanda, actualizacionesPlato){
    const comanda = ComandaRepository.obtenerPorId(idComanda);
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
    ComandaRepository.guardarComanda(idComanda, comanda);
    return comanda
  }
}