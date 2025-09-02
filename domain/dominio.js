import {remove} from "lodash/array";
import {isEmpty, max, maxBy, values} from "lodash";
import {sumBy} from "lodash/math";

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

export class Comanda {
  id;
  mesa;
  platos;
  bebidasListas;
  pagado;

  constructor(mesa, platos) {
    if(!mesa && !platos){
      return;
    }
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
      return values(EstadoComanda).find(e => e.categoria === maximaCategoriaLista)
    }
  }

  estaLista(categoria) {
    const platosCategoria = this.platos
      .filter(plato => plato.esDeCategoria(categoria));
    return !isEmpty(platosCategoria) && platosCategoria.every(plato => plato.estaListo);
  }

  totalAPagar(){
    return sumBy(this.platos, p => p.costoFinal())
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

  costoFinal() {
    return this.cantidad * this.plato.precio
  }
}






