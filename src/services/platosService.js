import {Plato} from "../domain/plato.js";

export class PlatosService {
  menu

  constructor(menu) {
    this.menu = menu;
  }

  async agregarPlato(datosPlato) {
    return await this.menu.agregarPlato(new Plato(datosPlato))
  }

  async actualizarPlato(platoId, actualizaciones) {
    const plato = await this.menu.obtenerPlatoPorId(platoId)
    plato.actualizar(actualizaciones)
    return await this.menu.guardarPlato(plato)
  }
}
