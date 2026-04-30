import {remove} from "lodash-es";
import {PlatoInexistente} from "../excepciones/platos.js";

export class Menu {
  db
  platos = []

  constructor(db) {
    this.db = db;
  }

  agregarPlato(plato) {
    plato.id = this.obtenerSiguienteId()
    this.platos.push(plato);
    return plato
  }

  listar() {
    return this.platos;
  }

  obtenerPlatoPorId(id) {
    const plato = this.platos.find(p => p.id === id);
    if (!plato) {
      throw new PlatoInexistente(id)
    }
    return plato;
  }

  guardarPlato(platoActualizado) {
    remove(this.platos, p => p.id === platoActualizado.id)
    this.platos.push(platoActualizado);
    return platoActualizado
  }

  obtenerSiguienteId() {
    return (this.platos[this.platos.length - 1]?.id || 0) + 1;
  }
}
