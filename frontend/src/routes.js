import {Route, Routes} from "react-router-dom";
import Layout from "./features/layout/Layout";
import Platos from "./features/platos/Platos";
import Bebidas from "./features/bebidas/bebidas";
import {Comanda} from "./features/pedido/comanda";
import {BrowserRouter} from "react-router";
import {useContext} from "react";
import {PlatosContext} from "./context/platosProvider";
import {BebidasContext} from "./context/bebidasProvider";

export const AppRoutes = () => {
  const {platos, platosLoading} = useContext(PlatosContext);
  const {bebidas} = useContext(BebidasContext);

  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout cantPlatos={platos.length}/>}>
        {<Route path="/platos" element={platosLoading ? "Cargando..." : <Platos/>}/>}
        <Route path="/bebidas" element={bebidas.length === 0 ? "Cargando..." : <Bebidas/>}/>
        <Route path="/comanda" element={<Comanda/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
}