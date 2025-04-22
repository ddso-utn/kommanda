import {remove} from "lodash-es";

export const ComandaRepository = {
  comandas: [],

  agregarComanda(comanda){
    this.comandas.push(comanda);
  },

  listar(){
    return this.comandas;
  },

  obtenerPorId(id){
    return this.comandas.find(c => c.id === id);
  },

  actualizarComanda(id, actualizacionesDeLaComanda){
    const comandaAActualizar = this.comandas.find(c => c.id === id);
    Object.assign(comandaAActualizar, actualizacionesDeLaComanda)
    return comandaAActualizar;
  },

  borrar(comanda){
    remove(this.comandas, c => c.nombre === comanda.nombre);
  }
}