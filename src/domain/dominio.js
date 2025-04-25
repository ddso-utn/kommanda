import {negate, remove} from "lodash-es";
import {isEmpty, max, maxBy, values} from "lodash-es";
import {sumBy} from "lodash-es";
import {PlatoInvalido} from "../excepciones/platos.js";
import {reemplazarValoresNoNulos} from "../utils/object-utils.js";

export class Plato {
  id;
  nombre;
  categoria;
  precio;
  estaDisponible;

  constructor({nombre, categoria, precio}) {
    this.validarParametros(precio, nombre, categoria);
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.estaDisponible = true;
  }

  validarParametros(precio, nombre, categoria) {
    if ([precio, nombre, categoria].some(v => !v)) {
      throw new PlatoInvalido(`El plato necesita precio, nombre y categoria, se recibio nombre: ${nombre}, categoria: ${categoria}, precio: ${precio}` );
    }
  }

  actualizar(actualizacionesParciales){
    reemplazarValoresNoNulos(this,actualizacionesParciales)
  }

  esDeCategoria(categoria) {
    this.categoria === categoria;
  }
}

export class Categoria {
  nombre;
  orden;

  static fromString(token){
    return values(Categoria).find(cat => cat.nombre === token)
  }

  constructor(nombre, orden) {
    this.nombre = nombre;
    this.orden = orden;
  }
}

Categoria.ENTRADA = new Categoria("ENTRADA", 0)
Categoria.PRINCIPAL = new Categoria("PRINCIPAL", 1)
Categoria.POSTRE = new Categoria("POSTRE", 2)
Categoria.BEBIDA = new Categoria("BEBIDA", 3)

export class Comanda {
  id;
  mesa;
  platos;
  bebidasListas;
  pagado;

  constructor(mesa, platos) {
    this.validarParametros(mesa)
    this.mesa = mesa;
    this.platos = platos || [];
    this.bebidasListas = false
    this.pagado = false;
  }

  validarParametros(mesa) {
    if (!mesa) {
      throw new ComandaInvalida(`La comanda necesita numero de mesa` );
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
    return values(Categoria).filter(categoria => categoria !== Categoria.BEBIDA && this.estaLista(categoria));
  }

  estado() {
    if (isEmpty(this.categoriasListas())) {
      return EstadoComanda.INGRESADO
    } else if (this.pagado) {
      return EstadoComanda.PAGADO
    } else {
      const maximaCategoriaLista = maxBy(this.categoriasListas(), c => c.orden)
      return values(EstadoComanda).filter(e => e.categoria == maximaCategoriaLista)
    }
  }

  estaLista(categoria) {
    return this.platos
      .filter(plato => plato.esDeCategoria(categoria))
      .every(plato => plato.estaListo);
  }

  totalAPagar(){
    return sumBy(this.platos, p => p.costoFinal())
  }
}

export class EstadoComanda {
  nombre;
  categoria;

  constructor(nombre, categoria) {
    this.nombre = nombre;
    this.categoria = categoria;
  }
}

EstadoComanda.INGRESADO = new EstadoComanda("INGRESADO")
EstadoComanda.ENTRADAS_LISTAS = new EstadoComanda("ENTRADAS_LISTAS", Categoria.ENTRADA)
EstadoComanda.PRINCIPALES_LISTOS = new EstadoComanda("PRINCIPALES_LISTOS", Categoria.PRINCIPAL)
EstadoComanda.POSTRES_LISTOS = new EstadoComanda("POSTRES_LISTOS", Categoria.POSTRE)
EstadoComanda.ENTREGADO = new EstadoComanda("ENTREGADO")
EstadoComanda.PAGADO = new EstadoComanda("PAGADO")

export class PlatoPedido {
  plato;
  cantidad;
  notas;
  estaListo;

  constructor(plato, cantidad, notas) {
    this.plato = plato;
    this.cantidad = cantidad;
    this.notas = notas;
    this.estaListo = false
  }

  esDeCategoria(categoria) {
    this.plato.esDeCategoria(categoria);
  }

  agregarNotas(notas) {
    this.notas = notas
  }

  asignarCantidad(cantdad) {
    this.cantidad = cantdad;
  }

  marcarListo(listo) {
    this.estaListo = listo;
  }

  costoFinal() {
    return this.cantidad * this.plato.precio
  }
}






