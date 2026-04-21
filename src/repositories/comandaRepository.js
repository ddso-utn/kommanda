import {clone, isUndefined, remove} from "lodash-es";

export const ComandaRepository = {
  comandas: [],

  agregarComanda(comanda){
    comanda.id = this.obtenerSiguienteId()
    this.comandas.push(comanda);
    return comanda
  },

  listar(){
    return this.comandas;
  },

  obtenerPorId(id){
    const comanda = this.comandas.find(c => c.id === id);
    if(!comanda){
      throw new ComandaInexistente(id)
    }
    return comanda;
  },

  guardarComanda(id, comandaActualizada){
    remove(this.comandas, c=> c.id === id)
    this.comandas.push(comandaActualizada);
    return comandaActualizada;
  },

  borrar(comanda){
    remove(this.comandas, c => c.nombre === comanda.nombre);
  },

  obtenerSiguienteId() {//TODO en una DB real no es necesario
    return (this.comandas[this.comandas.length - 1]?.id || 0) + 1;
  }
}