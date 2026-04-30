import {isUndefined, remove} from "lodash-es";
import {ComandaInexistente} from "../excepciones/comandas.js";

export class ComandaRepository {
  db
  comandas = []

  constructor(db) {
    this.db = db;
  }

  agregarComanda(comanda) {
    comanda.id = this.obtenerSiguienteId()
    this.comandas.push(comanda);
    return comanda
  }

  listar() {
    return this.comandas;
  }

  obtenerPorId(id) {
    const comanda = this.comandas.find(c => c.id === id);
    if (!comanda) {
      throw new ComandaInexistente(id)
    }
    return comanda;
  }

  listarPorFlags(platosPendientes, bebidasPendientes) {
    return this.comandas
      .filter(c =>
        (isUndefined(bebidasPendientes) || c.bebidasPendientes() === bebidasPendientes) &&
        (isUndefined(platosPendientes) || c.platosPendientes() == platosPendientes)
      );
  }

  guardarComanda(id, comandaActualizada) {
    remove(this.comandas, c => c.id === id)
    this.comandas.push(comandaActualizada);
    return comandaActualizada;
  }

  obtenerSiguienteId() {
    return (this.comandas[this.comandas.length - 1]?.id || 0) + 1;
  }
}
