import {omit, remove} from "lodash-es";
import {reemplazarValoresNoNulos} from "../utils/object-utils.js";

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

  actualizarPlatoPorId(id, actualizacionesDelPlato){
    const platoAActualizar = this.platos.find(p => p.id === id);
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