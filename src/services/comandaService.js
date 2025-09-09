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

  actualizarPlatoComanda(idComanda, actualizacionesPlato, ordenPlato){
    const comanda = ComandaRepository.obtenerPorId(idComanda);
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