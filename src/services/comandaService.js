import {Comanda, PlatoPedido} from "../domain/dominio.js";
import req from "express/lib/request.js";

export class ComandaService {
  comandaRepository
  menu

  constructor(comandaRepository, menu) {
    this.comandaRepository = comandaRepository;
    this.menu = menu;
  }

  async crearComanda(mesa, platos) {
    const platosPedidos = await Promise.all(platos.map(async p =>
      new PlatoPedido(
        await this.menu.obtenerPlatoPorId(p.idPlato),
        p.cantidad,
        p.notas
      )
    ));
    return await this.comandaRepository.agregarComanda(new Comanda(mesa, platosPedidos))
  }

  agregarPlatoComanda(idComanda, datosPlato) {
    const comanda = this.comandaRepository.obtenerPorId(idComanda);
    const nuevoPlato = new PlatoPedido(
      this.menu.obtenerPlatoPorId(datosPlato.idPlato),
      datosPlato.cantidad,
      datosPlato.notas
    )
    comanda.agregarPlato(nuevoPlato)
    return comanda;
  }

  actualizarBebidasComanda(idComanda){
    const comanda = this.comandaRepository.obtenerPorId(idComanda);
    comanda.marcarBebidasListas(req.body.bebidasListas)
    return comanda;
  }

  actualizarPlatoComanda(idComanda, actualizacionesPlato){
    const comanda = this.comandaRepository.obtenerPorId(idComanda);
    const ordenPlato = req.params.ordenPlato;
    if(actualizacionesPlato.notas) {
      comanda.agregarNotas(ordenPlato, actualizacionesPlato.notas)
    }
    if(actualizacionesPlato.cantidad){
      comanda.asignarCantidad(ordenPlato, actualizacionesPlato.cantidad)
    }
    if(actualizacionesPlato.estaListo){
      comanda.marcarListo(ordenPlato, actualizacionesPlato.estaListo)
    }
    this.comandaRepository.guardarComanda(idComanda, comanda);
    return comanda
  }
}