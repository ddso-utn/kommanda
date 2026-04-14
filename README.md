# Kommanda

Sistema de gestión de pedidos para restaurantes (POS backend), usado como ejercicio de práctica en la materia **Desarrollo de Software** (UTN).

El enunciado completo está disponible en: [Enunciado](https://docs.google.com/document/d/1QHOLDwn7LaETVxSIkOWK5nGT9xrBjatjZoiKafDebsw/edit?tab=t.0)

---

## Estructura de branches

El repositorio está organizado como una serie de incrementos progresivos pensados para acompañar las clases. Cada branch representa un estado del código en un punto específico de la evolución.

### Clase 1 — Dominio y primeros endpoints

| Branch | Contenido |
|--------|-----------|
| `clase-1/1-solo-dominio` | Dominio completo con validaciones, servidor Express con healthcheck |
| `clase-1/2-rutas-hardcodeadas` | Rutas de platos con respuestas hardcodeadas + OpenAPI spec + Swagger UI |
| `clase-1/3-crear-plato` | `POST /platos` implementado en `index.js`, sin manejo de errores |
| `clase-1/4-crear-plato-con-errores` | `POST /platos` con `try/catch` y manejo de `PlatoInvalido` |
| `clase-1/5-ver-platos` | `GET /platos` y `GET /platos/:id` implementados en `index.js` |
| `clase-1/6-platos-controller` | Lógica extraída a `PlatosController` — punto de partida de clase 2 |

La progresión detallada de cada clase está documentada en la carpeta [`clases/`](clases/).

---

## Cómo correr el proyecto

**Requisitos:** Node.js 22+, MongoDB corriendo en `localhost:27017`.

```bash
# Instalar dependencias
npm install

# Levantar MongoDB (si usás Docker)
docker run --rm -it --name mongo-kommanda -p 27017:27017 mongo

# Cargar datos iniciales
./seed.sh

# Iniciar el servidor
npm start
```

El servidor queda disponible en `http://localhost:3000`.

---

## Swagger UI

Una vez levantado el servidor, la documentación interactiva de la API está disponible en:

```
http://localhost:3000/api-docs
```
