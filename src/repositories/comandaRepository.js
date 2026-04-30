import {isUndefined} from "lodash-es";
import {ComandaInexistente} from "../excepciones/comandas.js";
import {Comanda} from "../domain/comanda.js";
import {Plato} from "../domain/plato.js";
import {Categoria} from "../domain/categoria.js";
import {PlatoPedido} from "../domain/platoPedido.js";
import {ObjectId} from "mongodb";

export class ComandaRepository {
  collection
  menu

  constructor(db, menu) {
    this.collection = db.collection("comandas");
    this.menu = menu;
  }

  aComandaDB(comanda) {
    const comandaDB = {
      ...comanda,
      platos: comanda.platos.map(this.aPlatoPedidoDB.bind(this)),
    };
    delete comandaDB.id;
    return comandaDB
  }

  aPlatoPedidoDB(platoPedido) {
    const platoPedidoDB = {
      ...platoPedido,
      idPlato: new ObjectId(platoPedido.plato.id),
    };
    delete platoPedidoDB.plato;
    return platoPedidoDB
  }

  async deComandaDB(comandaDB) {
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

  async dePlatoPedidoDB(platoPedidoDB) {
    const platoPedido = new PlatoPedido();
    Object.assign(platoPedido, {
      plato: await this.menu.obtenerPlatoPorId(platoPedidoDB.idPlato.toString()),
      cantidad: platoPedidoDB.cantidad,
      notas: platoPedidoDB.notas,
      estaListo: platoPedidoDB.estaListo
    })
    return platoPedido;
  }

  async agregarComanda(comanda) {
    const result = await this.collection.insertOne(this.aComandaDB(comanda));
    comanda.id = result.insertedId.toString();
    return comanda
  }

  async obtenerPorId(id) {
    const comandaDB = await this.collection.findOne({_id: new ObjectId(id)});
    if (!comandaDB) throw new ComandaInexistente(id)
    return await this.deComandaDB(comandaDB)
  }

  async listarPorFlags(platosPendientes, bebidasPendientes) {
    const pipeline = [
      ...(!isUndefined(bebidasPendientes) ? [{
        $match: {bebidasListas: {$eq: !bebidasPendientes}},
      }] : []),
      {
        $lookup: {
          from: "platos",
          localField: "platos.idPlato",
          foreignField: "_id",
          as: "plato_mappings",
        },
      }
    ]
    const cursor = this.collection.aggregate(pipeline)
    const comandas = [];
    for await (const doc of cursor) {
      const comanda = new Comanda();
      Object.assign(comanda, {
        id: doc._id.toString(),
        mesa: doc.mesa,
        platos: doc.platos.map(platoPedidoDB => {
          const platoDB = doc.plato_mappings.find(pm => pm._id.equals(platoPedidoDB.idPlato))
          const plato = new Plato();
          Object.assign(plato, {
            id: platoDB._id.toString(),
            nombre: platoDB.nombre,
            categoria: Categoria.fromString(platoDB.categoria),
            precio: platoDB.precio,
            estaDisponible: platoDB.estaDisponible,
          });
          const platoPedido = new PlatoPedido();
          Object.assign(platoPedido, {
            plato,
            cantidad: platoPedidoDB.cantidad,
            notas: platoPedidoDB.notas,
            estaListo: platoPedidoDB.estaListo
          })
          return platoPedido;
        }),
        bebidasListas: doc.bebidasListas,
        pagado: doc.pagado
      })
      comandas.push(comanda)
    }
    return comandas;
  }
}
