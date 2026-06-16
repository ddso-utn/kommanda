import {Titulo} from "../platos/Platos";

export const Comanda = ({comanda}) => {
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