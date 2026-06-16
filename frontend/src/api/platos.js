import axios from "axios";

const platosApi = axios.create({
  baseURL: 'https://68486e64ec44b9f34940e355.mockapi.io/kommanda'
})

export const getPlatosFromApi = async () => {
    const platos = await platosApi.get('platos-base')
      .then(r => r.data);
    const imagenes = await platosApi.get('/images')
      .then(r => r.data);
    return platos.map(p => ({
      ...p,
      imagen: imagenes[0][p.id]
    }));
}

export const getBanner = () => platosApi.get('banner').then(r => r.data.message)