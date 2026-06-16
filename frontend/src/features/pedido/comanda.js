import {Titulo} from "../platos/Platos";
import {useContext} from "react";
import {ComandaContext} from "../../context/comandaProvider";

export const Comanda = () => {
  const {comanda} = useContext(ComandaContext);
  return <div className="content">
    <Titulo texto="Comanda"/>
    <div>
      El pedido es:
      <ul>
        {[...comanda.platos, ...comanda.bebidas].map(ep => <li>{ep.nombre}</li>) }
      </ul>
    </div>
  </div>
}