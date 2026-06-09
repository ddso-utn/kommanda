const PLATOS = [
  {
    id: 1,
    nombre: "Pizza",
    imagen: "https://images.unsplash.com/photo-1601924582971-6e9f8d6d1e4e",
    precio: 16000,
    disponibleHastaHs: 20
  },
  {
    id: 2,
    nombre: "Empanadas",
    imagen: "https://images.unsplash.com/photo-1617196038435-9e4f9f6e8b1e",
    precio: 9000,
    disponibleHastaHs: 21
  },
  {
    id: 3,
    nombre: "Milanesa con papas",
    imagen: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
    precio: 18000,
    disponibleHastaHs: 22
  },
  {
    id: 4,
    nombre: "Ravioles con tuco",
    imagen: "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    precio: 17000,
    disponibleHastaHs: 20
  },
  {
    id: 5,
    nombre: "Hamburguesa completa",
    imagen: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    precio: 15000,
    disponibleHastaHs: 23
  },
  {
    id: 6,
    nombre: "Tarta de verdura",
    imagen: "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    precio: 12000,
    disponibleHastaHs: 19
  },
  {
    id: 7,
    nombre: "Sushi",
    imagen: "https://images.unsplash.com/photo-1553621042-f6e147245754",
    precio: 22000,
    disponibleHastaHs: 22
  },
  {
    id: 8,
    nombre: "Pollo al horno con papas",
    imagen: "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    precio: 18500,
    disponibleHastaHs: 20
  },
  {
    id: 9,
    nombre: "Fideos con salsa",
    imagen: "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    precio: 14000,
    disponibleHastaHs: 21
  },
  {
    id: 10,
    nombre: "Lomo con puré",
    imagen: "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    precio: 21000,
    disponibleHastaHs: 22
  },
  {
    id: 11,
    nombre: "Ensalada César",
    imagen: "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    precio: 13000,
    disponibleHastaHs: 19
  },
  {
    id: 12,
    nombre: "Tacos",
    imagen: "https://images.unsplash.com/photo-1603079841834-6e4f9f6e8b1e",
    precio: 16000,
    disponibleHastaHs: 22
  }
];

export const getPlatos = () => Promise.resolve(PLATOS)

export const putCommanda = (platos) => Promise.resolve({
  estado: "OK",
  mesa: 10,
  platos,
})