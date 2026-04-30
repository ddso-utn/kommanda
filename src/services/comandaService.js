import {Comanda} from "../domain/comanda.js";
import {PlatoPedido} from "../domain/platoPedido.js";

export class ComandaService {
  comandaRepository
  menu

  constructor(comandaRepository, menu) {
    this.comandaRepository = comandaRepository;
    this.menu = menu;
  }

  crearComanda(mesa, platos) {
    const platosPedidos = platos.map(p =>
      new PlatoPedido(
        this.menu.obtenerPlatoPorId(p.idPlato),
        p.cantidad,
        p.notas
      )
    );
    return this.comandaRepository.agregarComanda(new Comanda(mesa, platosPedidos))
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

  actualizarBebidasComanda(idComanda, bebidasListas) {
    const comanda = this.comandaRepository.obtenerPorId(idComanda);
    comanda.marcarBebidasListas(bebidasListas)
    return comanda;
  }

  actualizarPlatoComanda(idComanda, actualizacionesPlato, ordenPlato) {
    const comanda = this.comandaRepository.obtenerPorId(idComanda);
    if (actualizacionesPlato.notas) {
      comanda.agregarNotas(ordenPlato, actualizacionesPlato.notas)
    }
    if (actualizacionesPlato.cantidad) {
      comanda.asignarCantidad(ordenPlato, actualizacionesPlato.cantidad)
    }
    if (actualizacionesPlato.estaListo) {
      comanda.marcarListo(ordenPlato, actualizacionesPlato.estaListo)
    }
    this.comandaRepository.guardarComanda(idComanda, comanda);
    return comanda
  }
}
