import {remove} from "lodash-es";
import {isEmpty, max, maxBy, values} from "lodash-es";
import {sumBy} from "lodash-es";
import {PlatoInvalido} from "../exceptions/platos.js";

export class Plato {
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

  esDeCategoria(categoria) {
    this.categoria = categoria;
  }
}

export class Categoria {
  nombre;
  orden;

  static fromString(token){
    return values(Categoria).find(cat => cat.nombre.toUpperCase() === token)
  }

  constructor(nombre, orden) {
    this.nombre = nombre;
    this.orden = orden;
  }
}

Categoria.ENTRADA = new Categoria("Entrada", 0)
Categoria.PRINCIPAL = new Categoria("Principal", 1)
Categoria.POSTRE = new Categoria("Postre", 2)
Categoria.BEBIDA = new Categoria("Bebida", 3)

export class Comanda {
  mesa;
  platos;
  bebidasListas;
  pagado;

  constructor(mesa, platos) {
    this.mesa = mesa;
    this.platos = platos || [];
    this.bebidasListas = false
    this.pagado = false;
  }

  agregarPlato(plato) {
    this.platos.push(plato);
  }

  removerPlato(plato) {
    remove(this.platos, plato);
  }

  marcarBebidasListas(bebidasListas) {
    this.bebidasListas = bebidasListas;
  }

  categoriasListas() {
    return values(Categoria).filter(categoria => categoria !== Categoria.BEBIDA && this.estaLista(categoria));
  }

  estado() {
    const maximaCategoriaLista = maxBy(this.categoriasListas(), c => c.orden)
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

  agregarNota(nota) {
    this.nota = nota
  }

  incrementarCantidad(incremento) {
    this.cantidad += incremento;
  }

  decrementarCantidad(decremento) {
    this.cantidad = max(0, this.cantidad - decremento)
  }

  marcarListo(listo) {
    this.estaListo = listo;
  }

  costoFinal() {
    return this.cantidad * this.plato.precio
  }
}




