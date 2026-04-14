import {PlatoInvalido} from "../excepciones/platos.js";

export class Plato {
  id;
  nombre;
  categoria;
  precio;
  estaDisponible;

  static validarParametros({precio, nombre, categoria}) {
    if ([precio, nombre, categoria].some(v => !v)) {
      throw new PlatoInvalido(`El plato necesita precio, nombre y categoria, se recibio nombre: ${nombre}, categoria: ${categoria}, precio: ${precio}`);
    }
  }

  constructor({nombre, categoria, precio}) {
    Plato.validarParametros({precio, nombre, categoria});
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.estaDisponible = true;
  }

  esDeCategoria(categoria) {
    return this.categoria === categoria;
  }
}
