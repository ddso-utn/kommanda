# Clase 1 — Dominio y primeros endpoints

Cada branch es un incremento sobre el anterior. El punto de partida es el dominio completo con todas sus clases.

---

## `clase-1/1-solo-dominio`

Dominio completo y servidor Express vacío con un healthcheck.

- Clases de dominio: `Plato`, `Categoria`, `Comanda`, `PlatoPedido`, `EstadoComanda`
- Clases de excepción: `PlatoInvalido`, `PlatoInexistente`
- `index.js` solo expone `GET /healthCheck`

---

## `clase-1/2-rutas-hardcodeadas`

Diseño de la API de platos con rutas que devuelven respuestas hardcodeadas.

- Se agrega `docs.yaml` con la especificación OpenAPI completa de platos
- Las 5 rutas de platos responden con JSON estático, sin tocar el dominio ni la base de datos
- Útil para discutir el diseño de la API antes de implementarla

---

## `clase-1/3-crear-plato`

Primera implementación real: `POST /platos` crea un plato de verdad.

- Se agrega `src/repositories/menu.js` con el repositorio en memoria
- El handler de `POST /platos` construye un `Plato` y lo guarda en el `Menu`
- Sin manejo de errores: una entrada inválida crashea el request

---

## `clase-1/4-crear-plato-con-errores`

Se agrega manejo de errores a `crearPlato`.

- `POST /platos` envuelto en `try/catch`
- `PlatoInvalido` devuelve 400 con mensaje de error
- El repositorio lanza `PlatoInexistente` cuando no encuentra un plato por ID

---

## `clase-1/5-ver-platos`

`GET /platos` y `GET /platos/:id` implementados, todavía en `index.js`.

- `GET /platos` delega a `Menu.listar()`
- `GET /platos/:id` delega a `Menu.obtenerPlatoPorId()` y maneja `PlatoInexistente` → 404
- `PUT` y `PATCH` siguen con respuestas hardcodeadas

---

## `clase-1/6-platos-controller`

Refactor: la lógica de los tres endpoints se extrae a `PlatosController`.

- Se crea `src/controllers/platosController.js` con `crearPlato`, `verPlatos`, `verPlato`
- `index.js` queda solo con el registro de rutas
- Estado final equivalente al punto de partida de clase 2
