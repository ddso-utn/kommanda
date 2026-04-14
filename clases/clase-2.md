# Clase 2 — Comandas y capas de servicio

Punto de partida: `clase-1/6-platos-controller` (toda la API de platos funcionando con error handling).

En esta clase se incorpora el dominio de Comanda completo, se diseña la API extendida y se introduce una capa de servicio.

---

## `clase-2/1-base`

Alias del último paso de clase 1 (`clase-1/6-platos-controller`). Mismo commit. Acá arranca clase 2.

---

## `clase-2/2-actualizar-plato`

Implementa `PUT /platos/:id` con manejo de errores.

- Nuevo método `PlatosController.actualizarPlato`
- Usa `Plato.validarParametros` estática para validar el payload
- Maneja `PlatoInvalido` → 400 y `PlatoInexistente` → 404
- Se actualiza `docs.yaml` con la **API completa de clase 2** (todos los endpoints de comandas), siguiendo el patrón "diseñar la API antes de implementarla"
- Se agrega este archivo (`clases/clase-2.md`) y se actualiza el `README.md`

---

## `clase-2/3-crear-comanda`

Primera incorporación del dominio de Comanda a la aplicación.

- Nuevos archivos: `src/controllers/comandaController.js`, `src/repositories/comandaRepository.js`, `src/excepciones/comandas.js`
- Nuevas excepciones: `ComandaInvalida`, `ComandaInexistente`
- Endpoint: `POST /comandas` — construye una `Comanda` con sus `PlatoPedido` a partir del payload y la persiste
- Manejo de errores: `ComandaInvalida` o `PlatoInexistente` → 400

---

## `clase-2/4-ver-comanda`

Implementa `GET /comandas/:id` introduciendo el patrón **DTO Marshaller**.

- Función `aComandaRest(comanda)` que mapea el objeto de dominio a la representación REST (por ejemplo, resuelve `estado().nombre` y aplana los `PlatoPedido`)
- Se usa tanto en `verComanda` como en `crearComanda`
- Maneja `ComandaInexistente` → 404

---

## `clase-2/4.5-marcar-plato-listo-comanda-falla`

Implementa `PATCH /comandas/:id/platos/:ordenPlato`: permite marcar un plato como listo, actualizar cantidad o agregar notas.

**Punto de partida para debugging.** El endpoint funciona sintácticamente, pero contiene un bug latente que los estudiantes deberían descubrir:

- Los platos se crean con `categoria` guardado como string (`"PRINCIPAL"`) en lugar del enum `Categoria.PRINCIPAL`
- La comparación en `Plato.esDeCategoria` (`this.categoria === categoria`) compara string vs enum y siempre da `false`
- `Comanda.hayPlatosDe` nunca encuentra platos de ninguna categoría
- `Comanda.estado()` devuelve `INGRESADO` aunque todos los platos estén listos
- Síntoma observable: marcar todos los platos como listos no hace avanzar el estado de la comanda

---

## `clase-2/5-marcar-plato-listo-comanda`

Resuelve el bug introduciendo marshallers en `PlatosController`.

- `aPlatoRest(plato)` — convierte el objeto de dominio a representación REST (categoria pasa de enum a string)
- `dePlatoRest(platoRest)` — convierte el payload REST a objeto de dominio usando `Categoria.fromString()` para devolver el enum correcto
- Se usan en `crearPlato`, `verPlato`, `verPlatos` y `actualizarPlato`
- Con esto `Plato.categoria` queda correctamente como enum y el flujo de `estado()` empieza a funcionar

---

## `clase-2/6-comanda-service`

Refactor: extracción de la capa de servicio.

- Nuevo archivo: `src/services/comandaService.js`
- La lógica que antes estaba en `ComandaController` (construir `Comanda`, resolver platos del Menu, etc.) se mueve al service
- El controller queda con la responsabilidad HTTP pura: parsear request, llamar al service, serializar respuesta

---

## `clase-2/7-buscar-comanda`

Implementa `GET /comandas` con filtros.

- Query params: `bebidasPendientes`, `platosPendientes`
- Usa los métodos de dominio `Comanda.bebidasPendientes()` y `Comanda.platosPendientes()` para filtrar
