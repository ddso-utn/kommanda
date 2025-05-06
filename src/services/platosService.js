import {Plato} from "../domain/dominio.js";

export class PlatosService {
  menu

  constructor(menu) {
    this.menu = menu;
  }

  agregarPlato(datosPlato){
    return this.menu.agregarPlato(new Plato(datosPlato))
  }

  actualizarPlato(platoId, actualizaciones) {
    const plato = this.menu.obtenerPlatoPorId(platoId)
    plato.actualizar(actualizaciones)
    return this.menu.guardarPlato(plato)
  }

}