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

enum {

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

  todosPlatosListos(categoria){
    return this.platos
      .filter(p => p.esDeCategoria(categoria))
      .every(p => p.estaListo)
  }

  estado(){
    if(this.ningunPlatoListo()){
      return EstadoComanda.INGRESADO //TODO Reescribir
    } else if(this.todosPlatosListos(EstadoComanda.ENTRADAS_LISTAS.categoria)) {
      return EstadoComanda.ENTRADAS_LISTAS
    } else if(this.todosPlatosListos(EstadoComanda.PRINCIPALES_LISTOS.categoria)) {
      return EstadoComanda.PRINCIPALES_LISTOS
    } else if(this.todosPlatosListos(EstadoComanda.POSTRES_LISTOS.categoria)) {
      return EstadoComanda.POSTRES_LISTOS
    }
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

  incrementarCantidad(incremento) {
    this.cantidad += incremento;
  }

  decrementarCantidad(decremento) {
    this.cantidad = max(0, this.cantidad - decremento)
  }

  marcarListo(listo) {
    this.estaListo = listo;
  }
}






