export class ComandaInvalida extends Error {
  constructor(mensaje) {
    super(`Comanda Invalida: ${mensaje}`);
  }
}

export class ComandaInexistente extends Error {
  constructor(id) {
    super(`La comanda con id: ${id}, no existe`);
  }
}