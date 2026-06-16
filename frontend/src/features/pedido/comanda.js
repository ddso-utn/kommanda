import {Titulo} from "../platos/Platos";

export const Comanda = ({elementosPedidos}) => {
  return <div className="content">
    <Titulo texto="Comanda"/>
    <div>
      El pedido es:
      <ul>
        {elementosPedidos.map(ep => <li>{ep.nombre}</li>) }
      </ul>
    </div>
  </div>
}