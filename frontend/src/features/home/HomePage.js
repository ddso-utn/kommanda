import "./home.css"
import {useEffect, useState} from "react";
import {getPlatos, putCommanda} from "../../mockData/api";


const Titulo = ({texto}) => {
  return <h1 className="title">{texto}</h1>
}

const NavBar = ({logo, slogan}) => {
  return <nav className="nav">
    <div className="logo">{logo}</div>
    <div className="">{slogan}</div>
  </nav>
}

const CardPlato = ({nombre, imagen, precio, seleccionado, alSeleccionarPlato}) => {
  return <div
    className={`card ${seleccionado && "selected"}`}
    onClick={alSeleccionarPlato}
  >
    <h3>{nombre}</h3>
    <img src={imagen}/>
    <p className="price">${precio}</p>
  </div>
}

const ListaPlatos = ({platos, cambiarSeleccionPlato}) => {
  return <div className="platos">{
    platos.map((plato) => <CardPlato
      key={plato.id}
      nombre={plato.nombre}
      imagen={plato.imagen}
      precio={plato.precio}
      seleccionado={plato.seleccionado}
      alSeleccionarPlato={() => cambiarSeleccionPlato(plato.id)} // "onDishSelect"
    />)
  }</div>
}

const Home = () => {
  const [platos, setPlatos] = useState([])

  useEffect(() => {
    const cargarPlatos = async () => setPlatos(await getPlatos())
    cargarPlatos()
  }, [])

  const platosSeleccionados = () =>
    platos.filter(p => p.seleccionado)

  const agregarAComanda = async () => {
    console.log("Agregando platos...", platosSeleccionados().map(p => p.nombre))
    await putCommanda(platosSeleccionados())
    setPlatos(platos.map(p => ({...p, seleccionado: false})))
    alert("Platos agregados!")
  }

  const cambiarSeleccion = (plato) => {
    // Devuelve un plato nuevo modificado ... como en Haskell!
    return {...plato, seleccionado: !plato.seleccionado}
  }

  const cambiarSeleccionPlato = (idPlato) => setPlatos(
    // Devuelve tmb una lista nueva modificada.
    // Si es el plato buscado lo devuelve modificado; si no, no.
    platos.map(p => p.id === idPlato ? cambiarSeleccion(p) : p)
  )

  return (
    platos.length === 0 ? "Cargando..." : <section className="home">
      <NavBar logo="Kommanda" slogan="El sitio con +50 platos!"/>
      <div className="content">
        <Titulo texto="Platos"/>
        <ListaPlatos
          platos={platos}
          cambiarSeleccionPlato={cambiarSeleccionPlato}
        />
      </div>
      <div className="actions">
        <button onClick={agregarAComanda}>Agregar a comanda</button>
      </div>
    </section>
  )
};

export default Home;