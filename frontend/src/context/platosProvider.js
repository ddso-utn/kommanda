import {createContext, useEffect, useState} from "react";
import axios from "axios";

export const PlatosContext = createContext()

export const PlatosProvider = ({children}) => {
  const [platos, setPlatos] = useState([]);
  const [errorPlatos, setErrorPlatos] = useState();
  const [banner, setBanner] = useState('');
  const [platosLoading, setPlatosLoading] = useState(false);

  const cargarPlatos = async () => {
    try{
      //throw new Error("Error Inesperado")
      setPlatosLoading(true)
      const platos = await axios.get('https://68486e64ec44b9f34940e355.mockapi.io/kommanda/platos-base')
        .then(r => r.data);
      const imagenes = await axios.get('https://68486e64ec44b9f34940e355.mockapi.io/kommanda/images').then(r => r.data);
      setPlatos(platos.map(p => ({...p, imagen: imagenes[0][p.id]})));
      const banner = await axios.get('https://68486e64ec44b9f34940e355.mockapi.io/kommanda/banner').then(r => r.data);
      setBanner(banner[0].message)
      setPlatosLoading(false)
    } catch (error) {
      setErrorPlatos(error.message)
    }
  }

  useEffect(() => {
    cargarPlatos()
  }, [])

  const contextValue = {
    platos,
    errorPlatos,
    banner,
    platosLoading,
  }

  return <PlatosContext value={contextValue}>
    {children}
  </PlatosContext>
}