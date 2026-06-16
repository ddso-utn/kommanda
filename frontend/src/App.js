import Platos from './features/platos/Platos';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, useNavigate} from 'react-router';
import { Routes, Route } from 'react-router-dom';
import Layout from './features/layout/Layout';
import Bebidas from "./features/bebidas/bebidas";
import {Comanda} from "./features/pedido/comanda";
import {useEffect, useState} from "react";
import {getBebidas, getPlatos, putCommanda} from "./mockData/api";

function App() {
  const [platos, setPlatos] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [comanda, setComanda] = useState({platos: [], bebidas: []});

  useEffect(() => {
    const cargarPlatos = async () => setPlatos(await getPlatos())
    cargarPlatos()
  }, [])

  useEffect(() => {
    const cargarBebidas = async () => setBebidas(await getBebidas())
    cargarBebidas()
  }, [])

  const agregarPlatosAComanda = async (platosSeleccionados) => {
    console.log("Agregando platos...", platosSeleccionados.map(p => `${p.nombre} (Notas: ${p.notas})`))
    setComanda({...comanda, platos: platosSeleccionados})
  }

  const agregarBebidasAComanda = async (bebidasSeleccionadas) => {
    console.log("Agregando bebidas...", bebidasSeleccionadas.map(p => `${p.nombre})`))
    setComanda({...comanda, bebidas: bebidasSeleccionadas})
  }


  return (
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Layout cantPlatos={platos.length}  />} >
        {<Route path="/platos" element={platos.length === 0 ? "Cargando..." :  <Platos
          todosLosPlatos={platos}
          alAgregarAComanda={agregarPlatosAComanda}
        />}/>}
        <Route path="/bebidas" element={bebidas.length === 0 ? "Cargando..." : <Bebidas
          todasLasBebidas={bebidas}
          alAgregarAComanda={agregarBebidasAComanda}
        />} />
        <Route path="/comanda" element={<Comanda comanda={comanda} />} />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
