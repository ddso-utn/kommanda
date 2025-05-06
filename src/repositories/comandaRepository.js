import {isUndefined, remove} from "lodash-es";
import {ComandaInexistente} from "../excepciones/comandas.js";
import {Categoria, Comanda, Plato} from "../domain/dominio.js";
import {ObjectId} from "mongodb";

export class ComandaRepository {
  collection
  comandas = []

  constructor(db) {
    this.collection = this.collection = db.collection("comandas");;
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

  // deComandaDB(platoDB){
  //   const comanda = new Comanda();
  //   Object.assign(comanda, {
  //     id: platoDB._id.toString(),
  //     mesa: platoDB.mesa,
  //     platos: platoDB.platos.map(this.dePlatoPedidoDB.bind(this)),
  //     bebidasListas: platoDB.bebidasListas,
  //     pagado: platoDB.pagado
  //   })
  //   return plato;
  // }
  //
  // deComandaDB(platoDB){
  //   const comanda = new Comanda();
  //   Object.assign(comanda, {
  //     id: platoDB._id.toString(),
  //     mesa: platoDB.mesa,
  //     platos: platoDB.platos.map(this.dePlatoPedidoDB.bind(this)),
  //     bebidasListas: platoDB.bebidasListas,
  //     pagado: platoDB.pagado
  //   })
  //   return plato;
  // }

  async agregarComanda(comanda){
    const result = await this.collection.insertOne(this.aComandaDB(comanda));
    comanda.id = result.insertedId;
    return comanda
  }

  listar(){
    return this.comandas;
  }

  obtenerPorId(id){
    const comanda = this.comandas.find(c => c.id === id);
    if(!comanda){
      throw new ComandaInexistente(id)
    }
    return comanda;
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

  borrar(comanda){
    remove(this.comandas, c => c.nombre === comanda.nombre);
  }

  obtenerSiguienteId() {//TODO en una DB real no es necesario
    return (this.comandas[this.comandas.length - 1]?.id || 0) + 1;
  }
}