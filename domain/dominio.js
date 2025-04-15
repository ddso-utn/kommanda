import {remove} from "lodash/array";
import {isEmpty, max, maxBy, values} from "lodash";

class Plato {
  nombre;
  categoria;
  precio;
  estaDisponible;

  constructor(nombre, categoria, precio) {
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.estaDisponible = true;
  }

  esDeCategoria(categoria) {
    this.categoria = categoria;
  }
}

class Categoria {
  nombre;
  orden;


  constructor(nombre, orden) {
    this.nombre = nombre;
    this.orden = orden;
  }
}

Categoria.ENTRADA = new Categoria("Entrada", 0)
Categoria.PRINCIPAL = new Categoria("Principal", 1)
Categoria.POSTRE = new Categoria("Postre", 2)
Categoria.BEBIDA = new Categoria("Bebida", 3)

class Comanda {
  mesa;
  platos;
  estado;
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

  marcarBebidasListas() {
    this.bebidasListas = true;
  }

  categoriasListas() {
    return values(Categoria).filter(categoria => this.estaLista(categoria));
  }

  estado(){
    if(isEmpty(this.categoriasListas())){
      return EstadoComanda.INGRESADO
    } else if(this.pagado){
      return EstadoComanda.PAGADO
    } else {
      const maximaCategoriaLista = maxBy(this.categoriasListas(), c => c.orden)
      return values(EstadoComanda).filter(e => e.categoria)
    }
  }

  estaLista(categoria) {
    return this.platos
      .filter(plato => plato.esDeCategoria(categoria))
      .every(plato => plato.estaListo);
  }
}

class EstadoComanda {
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

class PlatoPedido {
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

  incrementarCantidad() {
    this.cantidad++
  }

  decrementarCantidad() {
    this.cantidad = max(0, this.cantidad - 1)
  }

  marcarListo() {
    this.estaListo = true;
  }
}






