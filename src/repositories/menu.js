import {remove} from "lodash-es";
import {PlatoInexistente} from "../excepciones/platos.js";

export class Menu {
  collection
  platos = []

  constructor(db) {
    this.collection = db.collection("platos");
  }

  toPlatoDB(plato){
    return {
      ...plato,
      categoria: plato.categoria.nombre,
    }
  }

  async agregarPlato(plato){
    const result = await this.collection.insertOne(this.toPlatoDB(plato));
    return {
      ...plato,
      id: result.insertedId.toString(),
    }
  }

  listar(){
    return this.platos;
  }

  obtenerPlatoPorId(id){
    const plato = this.platos.find(p => p.id === id);
    if(!plato){
      throw new PlatoInexistente(id)
    }
    return plato;
  }

  guardarPlato(platoActualizado){
    remove(this.platos, p=> p.id === platoActualizado.id)
    this.platos.push(platoActualizado);
    return platoActualizado
  }

  borrar(plato){
    remove(this.platos, p => p.nombre === plato.nombre);
  }

  obtenerSiguienteId() {//TODO en una DB real no es necesario
    return (this.platos[this.platos.length - 1]?.id || 0) + 1;
  }
}