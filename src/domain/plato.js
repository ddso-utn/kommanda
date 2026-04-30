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

  actualizar(actualizaciones) {
    if (actualizaciones.nombre) this.nombre = actualizaciones.nombre;
    if (actualizaciones.categoria) this.categoria = actualizaciones.categoria;
    if (actualizaciones.precio) this.precio = actualizaciones.precio;
  }

  esDeCategoria(categoria) {
    return this.categoria === categoria;
  }
}
