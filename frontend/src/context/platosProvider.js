import {createContext, useEffect, useState} from "react";
import {getBanner, getPlatosFromApi} from "../api/platos";

export const PlatosContext = createContext()

export const PlatosProvider = ({children}) => {
  const [platos, setPlatos] = useState([]);
  const [errorPlatos, setErrorPlatos] = useState();
  const [banner, setBanner] = useState('');
  const [platosLoading, setPlatosLoading] = useState(false);

  const cargarPlatos = async () => {
    setPlatos(await getPlatosFromApi());
  }
  const cargarBanner = async () => {
    setBanner(await getBanner())
  }

  const cargarTodo = async () => {
    try{
      setPlatosLoading(true)
      await cargarPlatos();
      await cargarBanner();
      setPlatosLoading(false)
    } catch (error) {
      setErrorPlatos(error.message)
    }
  }


  useEffect(() => {
    cargarTodo()
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