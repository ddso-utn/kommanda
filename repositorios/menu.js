export const Menu = {
  platos: [],

  agregarPlato(plato){
    plato.id = this.obtenerSiguienteId()
    this.platos.push(plato);
    return plato;
  },

  obtenerSiguienteId(){//TODO Esto en realidad no es necesario
    return (this.platos[this.platos.length - 1]?.id || 0) + 1
  },

  obtenerPlato(idPlato) {
    const plato = this.platos.find(p => p.id === idPlato);
    if(!plato){
      throw new Error(`El plato con id: ${idPlato} no existe`);
    }
    return plato;
  }
}