import {isUndefined, remove} from "lodash-es";
import {ComandaInexistente} from "../excepciones/comandas.js";
import {Categoria, Comanda, Plato, PlatoPedido} from "../domain/dominio.js";
import {ObjectId} from "mongodb";

export class ComandaRepository {
  collection
  menu
  comandas = []

  constructor(db, menu) {
    this.collection = this.collection = db.collection("comandas");
    this.menu = menu
  }

  aComandaDB(comanda){
    const comandaDB = {
      ...comanda,
      platos: comanda.platos.map(this.aPlatoPedidoDB.bind(this)),
    };
    delete comandaDB.id;
    return comandaDB
  }

  aPlatoPedidoDB(platoPedido){
    const platoPedidoDB = {
      ...platoPedido,
      idPlato: new ObjectId(platoPedido.plato.id),
    };
    delete platoPedidoDB.plato;
    return platoPedidoDB
  }

  async deComandaDB(comandaDB){
    const comanda = new Comanda();
    Object.assign(comanda, {
      id: comandaDB._id.toString(),
      mesa: comandaDB.mesa,
      platos: await Promise.all(comandaDB.platos.map(this.dePlatoPedidoDB.bind(this))),
      bebidasListas: comandaDB.bebidasListas,
      pagado: comandaDB.pagado
    })
    return comanda;
  }

  async dePlatoPedidoDB(platoPedidoDB){
    const platoPedido = new PlatoPedido();
    Object.assign(platoPedido, {
      plato: await this.menu.obtenerPlatoPorId(platoPedidoDB.idPlato.toString()),
      cantidad: platoPedidoDB.cantidad,
      notas: platoPedidoDB.notas,
      estaListo: platoPedidoDB.estaListo
    })
    return platoPedido;
  }

  async agregarComanda(comanda){
    const result = await this.collection.insertOne(this.aComandaDB(comanda));
    comanda.id = result.insertedId;
    return comanda
  }

  listar(){
    return this.comandas;
  }

  async obtenerPorId(id){
    const comanda = await this.collection.findOne({_id: new ObjectId(id)});
    if(!comanda){
      throw new ComandaInexistente(id)
    }
    return await this.deComandaDB(comanda)
  }

  listarPorFlags(platosPendientes, bebidasPendientes){
    return this.comandas
      .filter(c =>
        (isUndefined(bebidasPendientes) || c.bebidasPendientes() === bebidasPendientes) &&
        (isUndefined(platosPendientes) || c.platosPendientes() == platosPendientes)
      );
  }

  guardarComanda(id, comandaActualizada){
    remove(this.comandas, c=> c.id === id)
    this.comandas.push(comandaActualizada);
    return comandaActualizada;
  }

}