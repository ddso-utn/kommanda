import {ComandaRepository} from "../repositories/comandaRepository.js";
import {Comanda, Plato, PlatoPedido} from "../domain/dominio.js";
import {Menu} from "../repositories/menu.js";

export const PlatosService = {

  agregarPlato(datosPlato){
    return Menu.agregarPlato(new Plato(datosPlato))
  },

  actualizarPlato(platoId, actualizaciones) {
    const plato = Menu.obtenerPlatoPorId(platoId)
    plato.actualizar(actualizaciones)
    return  Menu.guardarPlato(plato)
  }
}