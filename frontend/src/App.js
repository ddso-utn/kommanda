import Platos from './features/platos/Platos';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, useNavigate} from 'react-router';
import { Routes, Route } from 'react-router-dom';
import Layout from './features/layout/Layout';
import Bebidas from "./features/bebidas/bebidas";
import {Comanda} from "./features/pedido/comanda";
import {useEffect, useState} from "react";
import {getPlatos, putCommanda} from "./mockData/api";

function App() {
  const [platos, setPlatos] = useState([]);
  const [comanda, setComanda] = useState({platos: []});

  useEffect(() => {
    const cargarPlatos = async () => setPlatos(await getPlatos())
    cargarPlatos()
  }, [])

  const agregarAComanda = async (platosSeleccionados) => {
    console.log("Agregando platos...", platosSeleccionados.map(p => `${p.nombre} (Notas: ${p.notas})`))
    setComanda({platos: platosSeleccionados})
  }

  return (
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Layout cantPlatos={platos.length}  />} >
        <Route path="/platos" element={<Platos todosLosPlatos={platos} alAgregarAComanda={agregarAComanda}/>} />
        <Route path="/bebidas" element={<Bebidas />} />
        <Route path="/comanda" element={<Comanda elementosPedidos={comanda.platos} />} />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
