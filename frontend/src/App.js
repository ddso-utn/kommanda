import Platos from './features/platos/Platos';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, useNavigate} from 'react-router';
import {Routes, Route} from 'react-router-dom';
import Layout from './features/layout/Layout';
import Bebidas from "./features/bebidas/bebidas";
import {Comanda} from "./features/pedido/comanda";
import {useEffect, useState} from "react";
import {getBebidas, getPlatos, putCommanda} from "./mockData/api";
import axios from "axios";

function App() {
  const [platos, setPlatos] = useState([]);
  const [bebidas, setBebidas] = useState([]);
  const [banner, setBanner] = useState('');
  const [platosLoading, setPlatosLoading] = useState(false);
  const [comanda, setComanda] = useState({platos: [], bebidas: []});

  const cargarPlatos = async () => {
    setPlatosLoading(true)
    const platos = await axios.get('https://68486e64ec44b9f34940e355.mockapi.io/kommanda/platos-base')
      .then(r => r.data);
    const imagenes = await axios.get('https://68486e64ec44b9f34940e355.mockapi.io/kommanda/images').then(r => r.data);
    setPlatos(platos.map(p => ({...p, imagen: imagenes[0][p.id]})));
    const banner = await axios.get('https://68486e64ec44b9f34940e355.mockapi.io/kommanda/banner').then(r => r.data);
    setBanner(banner[0].message)
    setPlatosLoading(false)
  }

  useEffect(() => {
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
        <Route path="/" element={<Layout cantPlatos={platos.length}/>}>
          {<Route path="/platos" element={platosLoading ? "Cargando..." : <Platos
            banner={banner}
            todosLosPlatos={platos}
            alAgregarAComanda={agregarPlatosAComanda}
          />}/>}
          <Route path="/bebidas" element={bebidas.length === 0 ? "Cargando..." : <Bebidas
            todasLasBebidas={bebidas}
            alAgregarAComanda={agregarBebidasAComanda}
          />}/>
          <Route path="/comanda" element={<Comanda comanda={comanda}/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
