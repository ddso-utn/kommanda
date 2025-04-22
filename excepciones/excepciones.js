export class PlatoInvalido extends Error {
  constructor(mensaje) {
    super(`Plato Invalido: ${mensaje}`);
  }
}

export class PlatoInexistente extends Error {
  constructor(id) {
    super(`El plato con id: ${id}, no existe`);
  }
}