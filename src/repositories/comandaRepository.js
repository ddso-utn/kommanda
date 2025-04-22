import {clone, isUndefined, remove} from "lodash-es";
import {Menu as PlatosRepository} from "./menu.js";
import {Comanda, PlatoPedido} from "../domain/dominio.js";
import {reemplazarValoresNoNulos} from "../utils/object-utils.js";

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

  buildComanda(comandaGuardada) {
    const comanda = new Comanda(comandaGuardada.mesa, comandaGuardada.platos);
    Object.assign(comanda, comandaGuardada)
    comanda.platos = comandaGuardada.platos.map(p => new PlatoPedido(
      PlatosRepository.obtenerPlatoPorId(p.platoId),
      p.cantidad,
      p.notas
    ));
    return comanda;
  },

  obtenerPorId(id){
    const comandaGuardada = this.comandas.find(c => c.id === id);
    return this.buildComanda(comandaGuardada);
  },

  listarPorFlags(platosPendientes, bebidasPendientes){
    return this.comandas.map(this.buildComanda.bind(this))
      .filter(c =>
        (isUndefined(bebidasPendientes) || c.bebidasPendientes() === bebidasPendientes) &&
        (isUndefined(platosPendientes) || c.platosPendientes() == platosPendientes)
      );
  },

  actualizarComanda(id, actualizacionesDeLaComanda){
    const comandaAActualizar = this.comandas.find(c => c.id === id);
    actualizacionesDeLaComanda.platos = actualizacionesDeLaComanda.platos.map(p => ({
      ...p,
      plato: undefined,
      platoId: p.plato.id
    }))
    reemplazarValoresNoNulos(comandaAActualizar, actualizacionesDeLaComanda)
    const comanda = new Comanda(comandaAActualizar.mesa, comandaAActualizar.platos);
    reemplazarValoresNoNulos(comanda, comandaAActualizar)
    comanda.platos = comandaAActualizar.platos.map(p => {
      const plato  = new PlatoPedido(
        PlatosRepository.obtenerPlatoPorId(p.platoId),
        p.cantidad,
        p.notas
      )
      plato.estaListo = p.estaListo
      return plato
    });
    return comanda;
  },

  borrar(comanda){
    remove(this.comandas, c => c.nombre === comanda.nombre);
  },

  obtenerSiguienteId() {//TODO en una DB real no es necesario
    return (this.comandas[this.comandas.length - 1]?.id || 0) + 1;
  }
}