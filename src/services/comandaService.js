import {Comanda} from "../domain/comanda.js";
import {PlatoPedido} from "../domain/platoPedido.js";

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

  async agregarPlatoComanda(idComanda, datosPlato) {
    const comanda = await this.comandaRepository.obtenerPorId(idComanda);
    const nuevoPlato = new PlatoPedido(
      await this.menu.obtenerPlatoPorId(datosPlato.idPlato),
      datosPlato.cantidad,
      datosPlato.notas
    )
    comanda.agregarPlato(nuevoPlato)
    return comanda;
  }

  async actualizarBebidasComanda(idComanda, bebidasListas) {
    const comanda = await this.comandaRepository.obtenerPorId(idComanda);
    comanda.marcarBebidasListas(bebidasListas)
    return comanda;
  }

  async actualizarPlatoComanda(idComanda, actualizacionesPlato, ordenPlato) {
    const comanda = await this.comandaRepository.obtenerPorId(idComanda);
    if (actualizacionesPlato.notas) {
      comanda.agregarNotas(ordenPlato, actualizacionesPlato.notas)
    }
    if (actualizacionesPlato.cantidad) {
      comanda.asignarCantidad(ordenPlato, actualizacionesPlato.cantidad)
    }
    if (actualizacionesPlato.estaListo) {
      comanda.marcarListo(ordenPlato, actualizacionesPlato.estaListo)
    }
    return comanda
  }
}
