import Platos from './features/platos/Platos';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router';
import { Routes, Route } from 'react-router-dom';
import Layout from './features/layout/Layout';
import Bebidas from "./features/bebidas/bebidas";

function App() {
  return (
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Layout  />} >
        <Route path="/platos" element={<Platos />} />
        <Route path="/bebidas" element={<Bebidas />} />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
