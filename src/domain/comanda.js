import {remove} from "lodash-es";
import {isEmpty, maxBy, values, sumBy} from "lodash-es";
import {Categoria} from "./categoria.js";
import {EstadoComanda} from "./estadoComanda.js";

export class Comanda {
  id;
  mesa;
  platos;
  bebidasListas;
  pagado;

  constructor(mesa, platos) {
    if (!mesa) return;
    this.validarParametros(mesa)
    this.mesa = mesa;
    this.platos = platos || [];
    this.bebidasListas = false
    this.pagado = false;
  }

  validarParametros(mesa) {
    if (!mesa) {
      throw new ComandaInvalida(`La comanda necesita numero de mesa`);
    }
  }

  agregarPlato(plato) {
    this.platos.push(plato);
  }

  removerPlato(plato) {
    remove(this.platos, plato);
  }

  agregarNotas(ordenPlato, notas) {
    this.platos[ordenPlato].agregarNotas(notas);
  }

  asignarCantidad(ordenPlato, cantidad) {
    this.platos[ordenPlato].asignarCantidad(cantidad);
  }

  marcarListo(ordenPlato, estaListo) {
    this.platos[ordenPlato].marcarListo(estaListo);
  }

  bebidasPendientes() {
    return !this.bebidasListas;
  }

  platosPendientes() {
    return this.platos.some(p => !p.estaListo);
  }

  marcarBebidasListas(bebidasListas) {
    this.bebidasListas = bebidasListas;
  }

  categoriasListas() {
    return values(Categoria).filter(categoria =>
      categoria !== Categoria.BEBIDA && this.estaLista(categoria) && this.hayPlatosDe(categoria)
    );
  }

  estado() {
    if (isEmpty(this.categoriasListas())) {
      return EstadoComanda.INGRESADO
    } else if (this.pagado) {
      return EstadoComanda.PAGADO
    } else {
      const maximaCategoriaLista = maxBy(this.categoriasListas(), c => c.orden)
      return values(EstadoComanda).find(e => e.categoria === maximaCategoriaLista)
    }
  }

  hayPlatosDe(categoria) {
    return !isEmpty(this.platos.filter(plato => plato.esDeCategoria(categoria)))
  }

  estaLista(categoria) {
    return this.platos
      .filter(plato => plato.esDeCategoria(categoria))
      .every(plato => plato.estaListo);
  }

  totalAPagar() {
    return sumBy(this.platos, p => p.costoFinal())
  }
}
