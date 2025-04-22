import {remove} from "lodash-es";

export const ComandaRepository = {
  comandas: [],

  agregarComanda(comanda){
    comanda.id = this.obtenerSiguienteId()
    const comandaAGuardar = {...comanda}
    comandaAGuardar.platos = comanda.platos.map(p => ({
      ...p,
      plato: undefined,
      platoId: p.plato.id
    }))
    this.comandas.push(comandaAGuardar);
    return comanda
  },

  listar(){
    return this.comandas;
  },

  obtenerPorId(id){
    return this.comandas.find(c => c.id === id);
  },

  actualizarComanda(id, actualizacionesDeLaComanda){
    const comandaAActualizar = this.obtenerPorId(id);
    actualizacionesDeLaComanda.platos = actualizacionesDeLaComanda.platos.map(p => ({
      ...p,
      plato: undefined,
      platoId: p.plato.id
    }))
    Object.assign(comandaAActualizar, actualizacionesDeLaComanda)
    return comandaAActualizar;
  },

  borrar(comanda){
    remove(this.comandas, c => c.nombre === comanda.nombre);
  },

  obtenerSiguienteId() {//TODO en una DB real no es necesario
    return (this.comandas[this.comandas.length - 1]?.id || 0) + 1;
  }
}