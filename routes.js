import {PlatosController} from "./src/controllers/platosController.js";
import {ComandaController} from "./src/controllers/comandaController.js";

export const configureRoutes = (app) => {
  app.post('/platos', PlatosController.crearPlato)
  app.get('/platos', PlatosController.verPlatos)
  app.put('/platos/:id', PlatosController.actualizarPlato)
  app.patch('/platos/:id', PlatosController.marcarPlatoDisponible)
  app.post('/comandas', ComandaController.crearComanda)
  app.get('/comandas/:id', ComandaController.verComanda)
  app.patch('/comandas/:id', ComandaController.actualizarBebidasComanda)
  app.post('/comandas/:id/platos', ComandaController.agregarPlatosComanda)
  app.patch('/comandas/:id/platos/:ordenPlato', ComandaController.actualizarPlatoComanda)
  app.get('/comandas', ComandaController.buscarComanda)
}