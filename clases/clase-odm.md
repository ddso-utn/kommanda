# Clase ODM — Persistencia con MongoDB

Punto de partida: `clase-2/7-buscar-comanda` (API completa funcionando con repositorios en memoria).

En esta clase se reemplaza el almacenamiento en memoria por MongoDB, introduciendo el patrón de inyección de dependencias y la capa de acceso a datos con ODM manual.

---

## `clase-odm/1-separando-archivos`

Refactor previo a introducir dependencias externas: se separa `index.js` en módulos con responsabilidades claras.

- `index.js` queda como punto de entrada mínimo
- `server.js` concentra la configuración de Express, middlewares y el inicio del servidor
- `routes.js` concentra el mapeo de rutas a handlers del controller
- Los controllers siguen siendo objetos planos con métodos estáticos; aún no hay inyección de dependencias

---

## `clase-odm/2-inyeccion-de-dependencias`

Introducción de MongoDB y del patrón de **inyección de dependencias** como paso arquitectónico previo a conectar la base de datos.

- Se agrega la dependencia `mongodb` al proyecto
- Nuevo directorio `src/app/` con la infraestructura de arranque:
  - `db.js` — establece la conexión con MongoDB usando `MongoClient`
  - `context.js` — **contenedor de dependencias**: instancia todos los componentes y los conecta (`Menu`, `ComandaRepository`, servicios, controllers)
  - `server.js` y `routes.js` se mueven a `src/app/`; las rutas ahora reciben las instancias del contexto
- Todos los controllers, services y repositories pasan de objetos planos con métodos estáticos a **clases con constructor** que reciben sus dependencias
- Se agrega `PlatosService` como clase independiente
- Se agrega el método `Plato.actualizar()` para que el service pueda delegar la modificación
- Los repositories reciben la instancia de `db` pero **siguen usando almacenamiento en memoria** — la conexión a la base de datos se establece pero aún no se usa

---

## `clase-odm/3-repo-platos`

Primer repositorio real con MongoDB: `Menu` se convierte en un repositorio de documentos.

- `Menu` deja de usar un array en memoria y pasa a operar sobre la colección `platos`
- Se introducen los marshallers de base de datos: `aPlatoDB` y `dePlatoDB` para convertir entre objetos de dominio y documentos BSON
- Los IDs de platos pasan de enteros auto-incrementales a `ObjectId` de MongoDB (representados como strings)
- Todos los métodos de `Menu` se vuelven `async`; los services y controllers de platos se actualizan para usar `await`
- `ComandaService.crearComanda` también se vuelve async porque necesita resolver los platos del repositorio

---

## `clase-odm/4-repo-comandas`

Se completa la persistencia: `ComandaRepository` pasa a MongoDB con una consulta de agregación para `listarPorFlags`.

- `ComandaRepository` opera sobre la colección `comandas`; se introducen `aComandaDB` y `dePlatoPedidoDB` como marshallers
- La reconstitución de una `Comanda` desde la base de datos (`deComandaDB`) requiere resolver los platos referenciados por ID, por lo que el repositorio recibe `menu` como dependencia (se actualiza `context.js`)
- `listarPorFlags` usa un pipeline de agregación con `$lookup` para traer los platos en una sola consulta
- Todos los métodos de `ComandaController` y `ComandaService` se vuelven `async`
- Se agrega `seed.sh`: script bash para cargar el menú inicial (20 platos) via `POST /platos`
