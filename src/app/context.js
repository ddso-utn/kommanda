import {Menu} from "../repositories/menu.js";
import {ComandaRepository} from "../repositories/comandaRepository.js";
import {ComandaService} from "../services/comandaService.js";
import {PlatosService} from "../services/platosService.js";
import {PlatosController} from "../controllers/platosController.js";
import {ComandaController} from "../controllers/comandaController.js";

const DB_NAME = "kommanda"

export const buildAppContext = (DB_CLIENT) => {
  const db = DB_CLIENT.db(DB_NAME)
  const menu = new Menu(db)
  const comandaRepository = new ComandaRepository(db, menu)
  const platosService = new PlatosService(menu)
  const comandaService = new ComandaService(comandaRepository, menu)
  const platosController = new PlatosController(platosService, menu)
  const comandaController = new ComandaController(comandaService, comandaRepository)

  return {
    menu,
    comandaRepository,
    comandaService,
    platosService,
    platosController,
    comandaController
  };
};