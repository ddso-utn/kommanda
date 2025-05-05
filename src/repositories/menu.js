import {remove} from "lodash-es";
import {PlatoInexistente} from "../excepciones/platos.js";
import {DB_CLIENT} from "../../index.js";

export const Menu = {
  COLLECTION_NAME: "menu",
  platos: [],

  agregarPlato(plato){
    plato.id = this.obtenerSiguienteId()
    this.platos.push(plato);
    return plato
  },

  listar(){
    return this.platos;
  },

  obtenerPlatoPorId(id){
    const plato = this.platos.find(p => p.id === id);
    if(!plato){
      throw new PlatoInexistente(id)
    }
    return plato;
  },

  guardarPlato(platoActualizado){
    remove(this.platos, p=> p.id === platoActualizado.id)
    this.platos.push(platoActualizado);
    return platoActualizado
  },

  borrar(plato){
    remove(this.platos, p => p.nombre === plato.nombre);
  },

  obtenerSiguienteId() {//TODO en una DB real no es necesario
    return (this.platos[this.platos.length - 1]?.id || 0) + 1;
  }
}