export const configureRoutes = (app, {platosController, comandaController}) => {
  app.post('/platos', platosController.crearPlato.bind(platosController))
  app.get('/platos', platosController.verPlatos.bind(platosController))
  app.get('/platos/:id', platosController.verPlato.bind(platosController))
  app.put('/platos/:id', platosController.actualizarPlato.bind(platosController))
  app.patch('/platos/:id', platosController.marcarPlatoDisponible.bind(platosController))
  app.post('/comandas', comandaController.crearComanda.bind(comandaController))
  app.get('/comandas/:id', comandaController.verComanda.bind(comandaController))
  app.patch('/comandas/:id', comandaController.actualizarBebidasComanda.bind(comandaController))
  app.post('/comandas/:id/platos', comandaController.agregarPlatosComanda.bind(comandaController))
  app.patch('/comandas/:id/platos/:ordenPlato', comandaController.actualizarPlatoComanda.bind(comandaController))
  app.get('/comandas', comandaController.buscarComanda.bind(comandaController))
}
