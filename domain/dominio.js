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
}

class Categoria {
  nombre;

  constructor(nombre) {
    this.nombre = nombre;
  }
}

const Categorias = {
  ENTRADA: new Categoria("Entrada"),
  PRINCIPAL: new Categoria("Principal"),
  POSTRE: new Categoria("Postre"),
  BEBIDA: new Categoria("Bebida"),
}

class PlatoPedido {
  plato;
  cantidad;
  notas;

   constructor(plato, cantidad, notas) {
     this.plato = plato;
     this.cantidad = cantidad;
     this.notas = notas;
   }
}






