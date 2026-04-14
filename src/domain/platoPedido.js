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
    return this.plato.esDeCategoria(categoria);
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
