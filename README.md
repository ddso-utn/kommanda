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

### Clase 2 — Comandas y capas de servicio

| Branch | Contenido |
|--------|-----------|
| `clase-2/1-base` | Alias del último paso de clase 1 |
| `clase-2/2-actualizar-plato` | `PUT /platos/:id` con manejo de errores + API completa de clase 2 documentada en Swagger |
| `clase-2/3-crear-comanda` | `POST /comandas` + `ComandaController`, `ComandaRepository` y excepciones de comanda |
| `clase-2/4-ver-comanda` | `GET /comandas/:id` introduciendo patrón DTO marshaller |
| `clase-2/4.5-marcar-plato-listo-comanda-falla` | `PATCH /comandas/:id/platos/:ordenPlato` con bug latente — base para debugging |
| `clase-2/5-marcar-plato-listo-comanda` | Resuelve el bug agregando marshallers `aPlatoRest`/`dePlatoRest` |
| `clase-2/6-comanda-service` | Capa de servicio extraída a `ComandaService` |
| `clase-2/7-buscar-comanda` | `GET /comandas` con filtros `bebidasPendientes` y `platosPendientes` |

### Clase ODM — Persistencia con MongoDB

| Branch | Contenido |
|--------|-----------|
| `clase-odm/1-separando-archivos` | Refactor: `index.js` separado en `server.js` + `routes.js` |
| `clase-odm/2-inyeccion-de-dependencias` | Introducción de MongoDB + contenedor de dependencias (`context.js`) + controllers/services/repos convertidos a clases |
| `clase-odm/3-repo-platos` | `Menu` reemplaza el array en memoria por la colección `platos` de MongoDB (async/await + marshallers BSON) |
| `clase-odm/4-repo-comandas` | `ComandaRepository` pasa a MongoDB con `$lookup` para resolver referencias + `seed.sh` |

La progresión detallada de cada clase está documentada en la carpeta [`clases/`](clases/).

---

## Ejercicio: clase 2 de Frontend

La clase 2 de Frontend (manejo de estado y API en React) está armada como un ejercicio para hacer por su cuenta. Son 12 pasos sobre Kommanda: en algunos se muestra cómo se resuelve y en otros les toca resolverlo a ustedes.

### Con un asistente con IA

1. Actualicen el repo con `git pull` en `main`, o clónenlo de nuevo.
2. Abran su asistente con IA (Claude Code, Copilot, Codex, Cursor, Gemini…) en la carpeta principal del repo.
3. Díganle algo como "quiero empezar el ejercicio de la clase 2 de Frontend".

El asistente les va a crear una carpeta `ejercicio/` con el código de cada paso. **Trabajen siempre en esa carpeta**, no en la principal. Ahí corren `npm install` y `npm start` (dentro de `ejercicio/frontend`).

Mientras trabajan:

- Si se traban, pídanle una pista. Les va a dar pistas de a una, sin darles la solución.
- Cuando terminen un paso, avísenle y les va a revisar el código.
- Si de verdad no les sale, díganle "me rindo, quiero ver la solución" y se las muestra.
- Al pasar de paso, guarda lo que hicieron en una rama `mi-solucion/paso-N`, así no pierden nada.

El asistente no reemplaza al docente. Si les dice que algo no estaba previsto en las pistas, o que su solución es distinta y conviene chequearla, consúltenlo con el docente. Y la idea es que lo resuelvan ustedes: si le piden que les haga el código, se pierden lo que el ejercicio quiere enseñar.

### Sin asistente

Los enunciados están en [`clases/frontend-2/enunciados.md`](clases/frontend-2/enunciados.md). Cada paso dice desde qué rama se arranca y tiene un link a la explicación y a la rama resuelta.

### Las explicaciones

Usen o no un asistente, las explicaciones de cada paso están en [`clases/frontend-2/soluciones.md`](clases/frontend-2/soluciones.md). Si en algún momento las necesitan, las pueden leer directamente ahí. Lo más importante de cada paso está marcado como **Idea clave**.

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
