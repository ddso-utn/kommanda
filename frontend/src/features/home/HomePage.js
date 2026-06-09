import "./home.css"
import {useState} from "react";


const PLATOS = [
  {
    "nombre": "Pizza",
    "imagen": "https://images.unsplash.com/photo-1601924582971-6e9f8d6d1e4e",
    "precio": 16000,
    "disponibleHastaHs": 20
  },
  {
    "nombre": "Empanadas",
    "imagen": "https://images.unsplash.com/photo-1617196038435-9e4f9f6e8b1e",
    "precio": 9000,
    "disponibleHastaHs": 21
  },
  {
    "nombre": "Milanesa con papas",
    "imagen": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
    "precio": 18000,
    "disponibleHastaHs": 22
  },
  {
    "nombre": "Ravioles con tuco",
    "imagen": "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    "precio": 17000,
    "disponibleHastaHs": 20
  },
  {
    "nombre": "Hamburguesa completa",
    "imagen": "https://images.unsplash.com/photo-1550547660-d9450f859349",
    "precio": 15000,
    "disponibleHastaHs": 23
  },
  {
    "nombre": "Tarta de verdura",
    "imagen": "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    "precio": 12000,
    "disponibleHastaHs": 19
  },
  {
    "nombre": "Sushi",
    "imagen": "https://images.unsplash.com/photo-1553621042-f6e147245754",
    "precio": 22000,
    "disponibleHastaHs": 22
  },
  {
    "nombre": "Pollo al horno con papas",
    "imagen": "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    "precio": 18500,
    "disponibleHastaHs": 20
  },
  {
    "nombre": "Fideos con salsa",
    "imagen": "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    "precio": 14000,
    "disponibleHastaHs": 21
  },
  {
    "nombre": "Lomo con puré",
    "imagen": "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    "precio": 21000,
    "disponibleHastaHs": 22
  },
  {
    "nombre": "Ensalada César",
    "imagen": "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    "precio": 13000,
    "disponibleHastaHs": 19
  },
  {
    "nombre": "Tacos",
    "imagen": "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    "precio": 16000,
    "disponibleHastaHs": 22
  }
]


const Titulo = ({texto}) => {
  return <h1 className="title">{texto}</h1>
}

const NavBar = ({logo, slogan}) => {
  return <navbar className="nav">
    <div className="logo">{logo}</div>
    <div className="">{slogan}</div>
  </navbar>
}

const CardPlato = ({nombre, imagen, precio}) => {
  const [seleccionado, setSeleccionado] = useState(false)

  const cambiarSeleccion = () => {
    setSeleccionado(!seleccionado)
  }

  return <div className={seleccionado ? "card selected" : "card"} onClick={cambiarSeleccion}>
    <h3>{nombre}</h3>
    <img src={imagen}/>
    <p className="price">${precio}</p>
  </div>
}

const ListaPlatos = ({}) => {
  return <div className="platos">{
    PLATOS.map((plato) => <CardPlato
      nombre={plato.nombre}
      imagen={plato.imagen}
      precio={plato.precio}
    />)
  }</div>
}

const agregarAComanda = (platos) => {
  console.log("Vamos a agregar Estos Platos", platos)
}

const Home = () => {
  return (
    <section className="home">
      <NavBar logo="Kommanda" slogan="El sitio con +50 platos!"/>
      <div className="content">
        <Titulo texto="Platos"/>
        <ListaPlatos/>
      </div>
      <div class="actions">
        <button>Agregar a comanda</button>
      </div>
    </section>
  )
};

export default Home; 