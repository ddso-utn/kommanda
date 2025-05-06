import {Plato} from "../domain/dominio.js";

export class PlatosService {
  menu

  constructor(menu) {
    this.menu = menu;
  }

  agregarPlato(datosPlato){
    return this.menu.agregarPlato(new Plato(datosPlato))
  }

  async actualizarPlato(platoId, actualizaciones) {
    const plato = await this.menu.obtenerPlatoPorId(platoId)
    plato.actualizar(actualizaciones)
    return await this.menu.guardarPlato(plato)
  }

}