import {ComandaRepository} from "../repositories/comandaRepository.js";
import {PlatoPedido} from "../domain/dominio.js";
import {Menu} from "../repositories/menu.js";

export const ComandaService = {
  agregarPlatoComanda(idComanda, datosPlato) {
    const comanda = ComandaRepository.obtenerPorId(idComanda);
    const nuevoPlato = new PlatoPedido(
      Menu.obtenerPlatoPorId(datosPlato.idPlato),
      datosPlato.cantidad,
      datosPlato.notas
    )
    comanda.agregarPlato(nuevoPlato)
    return comanda;
  }
}