import {clone, remove} from "lodash-es";
import {Menu as PlatosRepository} from "./menu.js";
import {Comanda, PlatoPedido} from "../domain/dominio.js";

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
    const comandaGuardada = this.comandas.find(c => c.id === id);
    const comanda = new Comanda(comandaGuardada.mesa, comandaGuardada.platos);
    Object.assign(comanda, comandaGuardada)
    comanda.platos = comandaGuardada.platos.map(p => new PlatoPedido(
      PlatosRepository.obtenerPlatoPorId(p.platoId),
      p.cantidad,
      p.notas
    ));
    return comanda;
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