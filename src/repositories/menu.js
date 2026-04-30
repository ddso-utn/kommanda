import {Plato} from "../domain/plato.js";
import {Categoria} from "../domain/categoria.js";
import {ObjectId} from "mongodb";
import {PlatoInexistente} from "../excepciones/platos.js";

export class Menu {
  collection

  constructor(db) {
    this.collection = db.collection("platos");
  }

  aPlatoDB(plato) {
    const platoDB = {
      ...plato,
      categoria: plato.categoria.nombre,
    };
    delete platoDB.id;
    return platoDB
  }

  dePlatoDB(platoDB) {
    const plato = new Plato();
    Object.assign(plato, {
      id: platoDB._id.toString(),
      nombre: platoDB.nombre,
      categoria: Categoria.fromString(platoDB.categoria),
      precio: platoDB.precio,
      estaDisponible: platoDB.estaDisponible,
    });
    return plato;
  }

  async agregarPlato(plato) {
    const result = await this.collection.insertOne(this.aPlatoDB(plato));
    return {
      ...plato,
      id: result.insertedId.toString(),
    }
  }

  async listar() {
    const cursor = await this.collection.find()
    const platos = [];
    for await (const doc of cursor) {
      platos.push(this.dePlatoDB(doc))
    }
    return platos;
  }

  async obtenerPlatoPorId(id) {
    const platoDB = await this.collection.findOne({_id: new ObjectId(id)});
    if (!platoDB) throw new PlatoInexistente(id)
    return this.dePlatoDB(platoDB)
  }

  async guardarPlato(platoActualizado) {
    await this.collection.updateOne(
      {_id: new ObjectId(platoActualizado.id)},
      {$set: this.aPlatoDB(platoActualizado)}
    );
    return platoActualizado
  }
}
