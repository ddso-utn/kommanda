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

const BEBIDAS = [
    {
      "id": 1,
      "nombre": "Agua sin gas",
      "imagen": "https://images.unsplash.com/photo-1528825871115-3581a5387919",
      "precio": 2500,
      "disponibleHastaHs": 23
    },
    {
      "id": 2,
      "nombre": "Agua con gas",
      "imagen": "https://images.unsplash.com/photo-1611078489935-f1d82f57b6b5",
      "precio": 2500,
      "disponibleHastaHs": 23
    },
    {
      "id": 3,
      "nombre": "Coca-Cola",
      "imagen": "https://images.unsplash.com/photo-1618886614638-f7b38f9a112b",
      "precio": 3000,
      "disponibleHastaHs": 23
    },
    {
      "id": 4,
      "nombre": "Sprite",
      "imagen": "https://images.unsplash.com/photo-1587049352854-48183f2ca233",
      "precio": 3000,
      "disponibleHastaHs": 23
    },
    {
      "id": 5,
      "nombre": "Fernet con Coca",
      "imagen": "https://images.unsplash.com/photo-1610413972258-cf6f23a3d3c4",
      "precio": 4500,
      "disponibleHastaHs": 3
    },
    {
      "id": 6,
      "nombre": "Cerveza artesanal",
      "imagen": "https://images.unsplash.com/photo-1607083206173-9bd6e125c633",
      "precio": 5000,
      "disponibleHastaHs": 2
    },
    {
      "id": 7,
      "nombre": "Cerveza en lata",
      "imagen": "https://images.unsplash.com/photo-1580910365203-4819399cb6e2",
      "precio": 4000,
      "disponibleHastaHs": 2
    },
    {
      "id": 8,
      "nombre": "Vino tinto",
      "imagen": "https://images.unsplash.com/photo-1608561412031-62c3b3cb4790",
      "precio": 6000,
      "disponibleHastaHs": 1
    },
    {
      "id": 9,
      "nombre": "Jugo natural de naranja",
      "imagen": "https://images.unsplash.com/photo-1577801590416-74f8c516b7b5",
      "precio": 3500,
      "disponibleHastaHs": 22
    },
    {
      "id": 10,
      "nombre": "Limonada con menta y jengibre",
      "imagen": "https://images.unsplash.com/photo-1551024734-0df20585245a",
      "precio": 4000,
      "disponibleHastaHs": 22
    },
    {
      "id": 11,
      "nombre": "Café espresso",
      "imagen": "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
      "precio": 2000,
      "disponibleHastaHs": 20
    },
    {
      "id": 12,
      "nombre": "Cappuccino",
      "imagen": "https://images.unsplash.com/photo-1511920170033-f8396924c348",
      "precio": 2500,
      "disponibleHastaHs": 20
    }
  ];

export const getPlatos = () => Promise.resolve(PLATOS)

export const getBebidas = () => Promise.resolve(BEBIDAS)

export const putCommanda = (platos) => Promise.resolve({
  estado: "OK",
  mesa: 10,
  platos,
})