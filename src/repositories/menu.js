import {omit, remove} from "lodash-es";
import {reemplazarValoresNoNulos} from "../utils/object-utils.js";
import {PlatoInexistente} from "../excepciones/platos.js";

export const Menu = {
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
    return this.platos.find(p => p.id === id);
  },

  actualizarPlatoPorId(id, actualizacionesDelPlato){
    const platoAActualizar = this.obtenerPlatoPorId(id);
    if(!platoAActualizar){
      throw new PlatoInexistente(id)
    }
    reemplazarValoresNoNulos(platoAActualizar,actualizacionesDelPlato)
    return platoAActualizar;
  },

  borrar(plato){
    remove(this.platos, p => p.nombre === plato.nombre);
  },

  obtenerSiguienteId() {//TODO en una DB real no es necesario
    return (this.platos[this.platos.length - 1]?.id || 0) + 1;
  }
}