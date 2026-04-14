import {values} from "lodash-es";

export class Categoria {
  nombre;
  orden;

  static fromString(token) {
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
