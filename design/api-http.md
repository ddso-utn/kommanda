# Módulo API HTTP

## Scope

El módulo API HTTP es la frontera del sistema con el mundo. Levanta el servidor Express,
publica la especificación OpenAPI, monta las once rutas de la API y, para cada una,
traduce en las dos direcciones: de la request HTTP a los argumentos que espera una
operación de negocio, y del objeto de dominio que vuelve — o de la excepción que se lanzó
— al JSON y al código de estado de la respuesta.

Es el único módulo que conoce `req`, `res`, códigos de estado y la forma JSON de la API.
No decide nada de negocio: qué es un plato válido, cómo se calcula el estado de una
comanda o cómo se guarda algo son responsabilidades de otros módulos.

## Component diagram

```mermaid
flowchart TD
  CL[Cliente HTTP]:::externo
  SE[Servidor]
  RU[Ruteo]
  PC[PlatosController]
  CC[ComandaController]
  SRV[Servicios]:::otro
  PER[Persistencia]:::otro
  DOM[Dominio]:::otro

  CL -->|"[GET /api-docs], [GET /healthCheck]<br/>consulta la documentación y el estado del servicio"| SE
  SE -->|"[configureRoutes(app, appContext)]<br/>monta las once rutas de negocio"| RU
  RU -->|"[crearPlato(req, res)], [verPlatos(req, res)], ...<br/>enlaza cada ruta a su handler"| PC
  RU -->|"[crearComanda(req, res)], [verComanda(req, res)], ...<br/>enlaza cada ruta a su handler"| CC
  CL -->|"[POST /platos], [GET /platos/:id], ...<br/>opera sobre el menú"| PC
  CL -->|"[POST /comandas], [PATCH /comandas/:id], ...<br/>opera sobre las comandas"| CC
  PC -->|"[agregarPlato(datosPlato)], [actualizarPlato(platoId, actualizaciones)]<br/>delega los casos que escriben"| SRV
  CC -->|"[crearComanda(mesa, platos)], [agregarPlatoComanda(...)], ...<br/>delega los casos que modifican la comanda"| SRV
  PC -->|"[listar()], [obtenerPlatoPorId(id)], [guardarPlato(platoActualizado)]<br/>lee y guarda directo, salteando el servicio"| PER
  CC -->|"[obtenerPorId(id)], [listarPorFlags(...)]<br/>lee directo, salteando el servicio"| PER
  PC -->|"[Categoria.fromString(token)]<br/>traduce el nombre de categoría que llega en el body"| DOM
  CC -->|"[estado()]<br/>lee el estado calculado para serializar la comanda"| DOM

  classDef externo stroke-dasharray: 5 5
  classDef otro stroke-dasharray: 5 5
```

## Servidor

**Responsabilidad.** Configurar la aplicación Express y ponerla a escuchar: el parseo de
JSON, la interfaz de Swagger sobre `docs.yaml`, el endpoint de salud, y el montaje de las
rutas de negocio.

**Estado.** La aplicación Express, el puerto y la especificación OpenAPI leída de disco.

**Interfacing points.** `startServer(app, port, appContext)`.

### `startServer(app, port, appContext)`

Instala `body-parser` en modo JSON, publica Swagger UI en `/api-docs` con la
especificación parseada de `docs.yaml`, define `GET /healthCheck` en línea, delega el
montaje de las rutas de negocio al Ruteo y llama a `listen`.

```mermaid
sequenceDiagram
  box transparent fuera de este módulo
    participant AR as Arranque
  end
  box API HTTP
    participant SE as Servidor
    participant RU as Ruteo
  end

  AR->>SE: [startServer(app, port, appContext)] pide levantar el servidor
  SE->>SE: [use(bodyParser.json())] y [use('/api-docs', swaggerUi)] instala middleware y documentación
  SE->>SE: [get('/healthCheck', handler)] define el endpoint de salud
  SE->>RU: [configureRoutes(app, appContext)] monta las rutas de negocio
  SE->>SE: [listen(port)] queda escuchando
  SE-->>AR: la aplicación Express ya escuchando
```

#### Edge cases

`docs.yaml` se lee de forma síncrona al importar el módulo, con una ruta relativa al
directorio de trabajo. Arrancar el proceso desde otro directorio rompe el import antes de
que `startServer` llegue a ejecutarse.

## Ruteo

**Responsabilidad.** Ser la tabla que mapea método y path a la operación de controlador
que responde. Es el único lugar donde se ve la superficie completa de la API de un
vistazo.

**Estado.** Ninguno propio — escribe sobre la aplicación Express que recibe.

**Interfacing points.** `configureRoutes(app, appContext)`.

### `configureRoutes(app, appContext)`

Toma del contexto los dos controladores y registra las once rutas. Cada handler se
registra con `bind` al controlador, porque Express lo invoca desacoplado de su objeto y
sin eso `this` llegaría indefinido dentro del método.

| Método | Path | Operación |
|---|---|---|
| POST | `/platos` | `PlatosController.crearPlato` |
| GET | `/platos` | `PlatosController.verPlatos` |
| GET | `/platos/:id` | `PlatosController.verPlato` |
| PUT | `/platos/:id` | `PlatosController.actualizarPlato` |
| PATCH | `/platos/:id` | `PlatosController.marcarPlatoDisponible` |
| POST | `/comandas` | `ComandaController.crearComanda` |
| GET | `/comandas` | `ComandaController.buscarComanda` |
| GET | `/comandas/:id` | `ComandaController.verComanda` |
| PATCH | `/comandas/:id` | `ComandaController.actualizarBebidasComanda` |
| POST | `/comandas/:id/platos` | `ComandaController.agregarPlatosComanda` |
| PATCH | `/comandas/:id/platos/:ordenPlato` | `ComandaController.actualizarPlatoComanda` |

## PlatosController

**Responsabilidad.** Responder los cinco endpoints del menú: leer de la request lo que
cada operación necesita, invocarla, y devolver el plato serializado o el error traducido
a un código de estado.

**Estado.** Las referencias al `PlatosService` y al `Menu`.

**Interfacing points.** `new PlatosController(platosService, menu)`, `crearPlato(req, res)`,
`verPlatos(req, res)`, `verPlato(req, res)`, `actualizarPlato(req, res)`,
`marcarPlatoDisponible(req, res)`.

### `new PlatosController(platosService, menu)`

Guarda las dos referencias que sus handlers usan. El segundo parámetro es la huella, en
el cableado, de que tres de los cinco endpoints leen del `Menu` sin pasar por el
servicio.

### `crearPlato(req, res)`

Convierte el body al vocabulario del dominio, le pide al servicio que dé de alta el
plato, y responde 201 con el plato ya con id. Si el plato no valida, responde 400 con el
mensaje de la excepción.

```mermaid
sequenceDiagram
  box transparent fuera de este módulo
    participant CL as Cliente HTTP
    participant SRV as Servicios
    participant DOM as Dominio
  end
  box API HTTP
    participant PC as PlatosController
  end

  CL->>PC: [POST /platos] envía nombre, categoría y precio
  PC->>DOM: [Categoria.fromString(token)] traduce el nombre de categoría
  PC->>SRV: [agregarPlato(datosPlato)] pide el alta
  alt el plato no valida
    SRV-->>PC: lanza PlatoInvalido
    PC-->>CL: 400 con el mensaje del error
  else válido
    SRV-->>PC: Plato con su id
    PC-->>CL: 201 con el plato serializado
  end
```

#### Edge cases

Una categoría desconocida hace que `Categoria.fromString` devuelva `undefined`, y el
constructor del `Plato` la rechaza como campo faltante: la respuesta es 400 con un
mensaje que dice que faltó la categoría, no que era inválida.

Cualquier excepción que no sea `PlatoInvalido` se loguea y no produce respuesta: la
request queda sin contestar hasta que el cliente corta.

### `verPlatos(req, res)`

Pide al `Menu` la lista completa y responde 200 con todos los platos serializados. No
pasa por el servicio y no maneja errores.

```mermaid
sequenceDiagram
  box transparent fuera de este módulo
    participant CL as Cliente HTTP
    participant PER as Persistencia
  end
  box API HTTP
    participant PC as PlatosController
  end

  CL->>PC: [GET /platos] pide el menú completo
  PC->>PER: [listar()] pide todos los platos
  PER-->>PC: lista de Plato
  PC-->>CL: 200 con la lista serializada
```

### `verPlato(req, res)`

Pide al `Menu` el plato del path. Responde 200 con el plato serializado, o 404 si el
`Menu` lanza `PlatoInexistente`. No pasa por el servicio.

```mermaid
sequenceDiagram
  box transparent fuera de este módulo
    participant CL as Cliente HTTP
    participant PER as Persistencia
  end
  box API HTTP
    participant PC as PlatosController
  end

  CL->>PC: [GET /platos/:id] pide un plato puntual
  PC->>PER: [obtenerPlatoPorId(req.params.id)] pide el plato
  alt no existe
    PER-->>PC: lanza PlatoInexistente
    PC-->>CL: 404 con el mensaje del error
  else existe
    PER-->>PC: Plato
    PC-->>CL: 200 con el plato serializado
  end
```

### `actualizarPlato(req, res)`

Convierte el body al vocabulario del dominio y le pide al servicio que aplique los
cambios. Responde 200 con el plato actualizado, 404 si el plato no existe, 400 si la
actualización lo deja inválido.

```mermaid
sequenceDiagram
  box transparent fuera de este módulo
    participant CL as Cliente HTTP
    participant SRV as Servicios
    participant DOM as Dominio
  end
  box API HTTP
    participant PC as PlatosController
  end

  CL->>PC: [PUT /platos/:id] envía los campos a cambiar
  PC->>DOM: [Categoria.fromString(token)] traduce la categoría si vino
  PC->>SRV: [actualizarPlato(req.params.id, actualizaciones)] pide aplicar los cambios
  alt el plato no existe
    SRV-->>PC: lanza PlatoInexistente
    PC-->>CL: 404 con el mensaje del error
  else la actualización lo deja inválido
    SRV-->>PC: lanza PlatoInvalido
    PC-->>CL: 400 con el mensaje del error
  else válido
    SRV-->>PC: Plato actualizado
    PC-->>CL: 200 con el plato serializado
  end
```

### `marcarPlatoDisponible(req, res)`

Trae el plato del `Menu`, le fija `estaDisponible` al valor del body o lo invierte si el
body no lo trae, y lo manda a guardar. Responde 200 con el plato actualizado, o 404 si no
existe.

```mermaid
sequenceDiagram
  box transparent fuera de este módulo
    participant CL as Cliente HTTP
    participant PER as Persistencia
    participant DOM as Dominio
  end
  box API HTTP
    participant PC as PlatosController
  end

  CL->>PC: [PATCH /platos/:id] envía estaDisponible o nada
  PC->>PER: [obtenerPlatoPorId(req.params.id)] trae el plato
  alt no existe
    PER-->>PC: lanza PlatoInexistente
    PC-->>CL: 404 con el mensaje del error
  else existe
    PER-->>PC: Plato
    PC->>DOM: [estaDisponible = req.body.estaDisponible ?? !estaDisponible] asigna el campo sin una operación del dominio que lo cubra
    PC->>PER: [guardarPlato(platoActualizado)] persiste el cambio
    PER-->>PC: Plato actualizado
    PC-->>CL: 200 con el plato serializado
  end
```

#### Edge cases

La regla "si no viene el valor, invertir" es la única regla de negocio que vive en este
módulo. `Plato` no expone una operación para cambiar la disponibilidad, así que el
controlador escribe el campo directamente.

### Specifics

La traducción entre el JSON de la API y el dominio la hacen dos funciones privadas del
archivo: `dePlatoRest` — que convierte el nombre de categoría del body en la `Categoria`
del dominio — y `aPlatoRest`, que hace el camino inverso al serializar. No son
componentes: son el detalle interno de cómo este controlador cumple su responsabilidad de
traducir.

## ComandaController

**Responsabilidad.** Responder los seis endpoints de comandas: leer de la request lo que
cada operación necesita, invocarla, y devolver la comanda serializada — con su estado ya
calculado — o el error traducido a un código de estado.

**Estado.** Las referencias al `ComandaService` y al `ComandaRepository`.

**Interfacing points.** `new ComandaController(comandaService, comandaRepository)`,
`crearComanda(req, res)`, `verComanda(req, res)`, `agregarPlatosComanda(req, res)`,
`actualizarBebidasComanda(req, res)`, `actualizarPlatoComanda(req, res)`,
`buscarComanda(req, res)`.

### `new ComandaController(comandaService, comandaRepository)`

Guarda las dos referencias que sus handlers usan. El segundo parámetro es la huella del
par de endpoints que leen del repositorio sin pasar por el servicio.

### `crearComanda(req, res)`

Le pasa al servicio la mesa y la lista de platos del body. Responde 201 con la comanda
serializada, o 400 si la comanda es inválida o alguno de los platos no existe en el menú.

```mermaid
sequenceDiagram
  box transparent fuera de este módulo
    participant CL as Cliente HTTP
    participant SRV as Servicios
    participant DOM as Dominio
  end
  box API HTTP
    participant CC as ComandaController
  end

  CL->>CC: [POST /comandas] envía mesa y platos
  CC->>SRV: [crearComanda(req.body.mesa, req.body.platos)] pide abrir la comanda
  alt la comanda es inválida
    SRV-->>CC: lanza ComandaInvalida
    CC-->>CL: 400 con el mensaje del error
  else alguno de los platos no existe
    SRV-->>CC: lanza PlatoInexistente
    CC-->>CL: 400 con el mensaje del error
  else válida
    SRV-->>CC: Comanda con su id
    CC->>DOM: [estado()] calcula el estado para la respuesta
    DOM-->>CC: EstadoComanda
    CC-->>CL: 201 con la comanda serializada
  end
```

### `verComanda(req, res)`

Pide la comanda al `ComandaRepository`. Responde 200 con la comanda serializada, o 404 si
lanza `ComandaInexistente`. No pasa por el servicio.

```mermaid
sequenceDiagram
  box transparent fuera de este módulo
    participant CL as Cliente HTTP
    participant PER as Persistencia
    participant DOM as Dominio
  end
  box API HTTP
    participant CC as ComandaController
  end

  CL->>CC: [GET /comandas/:id] pide una comanda puntual
  CC->>PER: [obtenerPorId(req.params.id)] pide la comanda
  alt no existe
    PER-->>CC: lanza ComandaInexistente
    CC-->>CL: 404 con el mensaje del error
  else existe
    PER-->>CC: Comanda
    CC->>DOM: [estado()] calcula el estado para la respuesta
    DOM-->>CC: EstadoComanda
    CC-->>CL: 200 con la comanda serializada
  end
```

### `agregarPlatosComanda(req, res)`

Le pasa al servicio el id de la comanda y el body con el plato a sumar. Responde 200 con
la comanda serializada, o 400 si la comanda o el plato no existen.

```mermaid
sequenceDiagram
  box transparent fuera de este módulo
    participant CL as Cliente HTTP
    participant SRV as Servicios
    participant DOM as Dominio
  end
  box API HTTP
    participant CC as ComandaController
  end

  CL->>CC: [POST /comandas/:id/platos] envía idPlato, cantidad y notas
  CC->>SRV: [agregarPlatoComanda(req.params.id, req.body)] pide sumar el plato
  alt el plato del menú no existe
    SRV-->>CC: lanza PlatoInexistente
    CC-->>CL: 400 con el mensaje del error
  else la comanda no existe
    SRV-->>CC: lanza ComandaInexistente
    CC-->>CL: ninguna respuesta - la excepción se loguea y la request queda abierta
  else ambos existen
    SRV-->>CC: Comanda modificada en memoria
    CC->>DOM: [estado()] calcula el estado para la respuesta
    CC-->>CL: 200 con la comanda serializada
  end
```

#### Edge cases

`ComandaInexistente` no está entre las excepciones que este handler traduce: si la
comanda no existe, se loguea y la request queda sin respuesta.

### `actualizarBebidasComanda(req, res)`

Le pasa al servicio el id y el flag `bebidasListas` del body. Responde 200 con la comanda
serializada.

```mermaid
sequenceDiagram
  box transparent fuera de este módulo
    participant CL as Cliente HTTP
    participant SRV as Servicios
    participant DOM as Dominio
  end
  box API HTTP
    participant CC as ComandaController
  end

  CL->>CC: [PATCH /comandas/:id] envía bebidasListas
  CC->>SRV: [actualizarBebidasComanda(req.params.id, req.body.bebidasListas)] pide marcarlas
  alt la comanda no existe
    SRV-->>CC: lanza ComandaInexistente
    CC-->>CL: ninguna respuesta - la excepción se loguea y la request queda abierta
  else existe
    SRV-->>CC: Comanda modificada en memoria
    CC->>DOM: [estado()] calcula el estado para la respuesta
    CC-->>CL: 200 con la comanda serializada
  end
```

### `actualizarPlatoComanda(req, res)`

Le pasa al servicio el id de la comanda, el body con notas, cantidad o `estaListo`, y el
índice del plato dentro de la comanda. Responde 200 con la comanda serializada, 404 si la
comanda no existe, 400 si es inválida o el plato no existe.

```mermaid
sequenceDiagram
  box transparent fuera de este módulo
    participant CL as Cliente HTTP
    participant SRV as Servicios
    participant DOM as Dominio
  end
  box API HTTP
    participant CC as ComandaController
  end

  CL->>CC: [PATCH /comandas/:id/platos/:ordenPlato] envía notas, cantidad o estaListo
  CC->>SRV: [actualizarPlatoComanda(req.params.id, req.body, req.params.ordenPlato)] pide aplicarlos
  alt la comanda no existe
    SRV-->>CC: lanza ComandaInexistente
    CC-->>CL: 404 con el mensaje del error
  else existe
    SRV-->>CC: Comanda modificada en memoria
    CC->>DOM: [estado()] recalcula el estado para la respuesta
    DOM-->>CC: EstadoComanda
    CC-->>CL: 200 con la comanda serializada
  end
```

#### Edge cases

`ordenPlato` llega como string desde el path y se usa tal cual como índice del arreglo de
platos. Funciona porque el acceso por índice de JavaScript convierte la clave, pero un
índice fuera de rango no da 404 — da un `TypeError` que ningún `catch` traduce.

### `buscarComanda(req, res)`

Parsea los dos flags de query con `JSON.parse` para convertir `"true"` y `"false"` en
booleanos, y se los pasa al repositorio. Responde 200 con la lista serializada. No pasa
por el servicio y no maneja errores.

```mermaid
sequenceDiagram
  box transparent fuera de este módulo
    participant CL as Cliente HTTP
    participant PER as Persistencia
    participant DOM as Dominio
  end
  box API HTTP
    participant CC as ComandaController
  end

  CL->>CC: [GET /comandas?bebidasPendientes&platosPendientes] pide las comandas que filtran
  CC->>PER: [listarPorFlags(platosPendientes, bebidasPendientes)] pide la búsqueda
  PER-->>CC: lista de Comanda
  loop por cada comanda
    CC->>DOM: [estado()] calcula el estado para la respuesta
  end
  CC-->>CL: 200 con la lista serializada
```

#### Edge cases

Un valor de query que no sea JSON válido — `?bebidasPendientes=si` — hace que
`JSON.parse` lance, y no hay `try` alrededor: la request muere con el error por defecto
de Express.

### Specifics

La serialización la hace `aComandaRest`, una función privada del archivo: aplana cada
`PlatoPedido` a nombre, cantidad, precio, notas y estado, y pide a la comanda su
`estado()` para exponerlo como un string. Es el único lugar donde el estado calculado de
una comanda se convierte en texto.

## Rejected alternatives

**Un controlador por endpoint.** Agruparlos por recurso mantiene junta la traducción
JSON del recurso — `aPlatoRest` y `dePlatoRest` tienen un solo dueño — y deja el archivo
de rutas legible como la tabla de la API.

**Middleware de errores centralizado.** Cada handler traduce sus propias excepciones a
códigos de estado. Es más repetitivo, pero deja visible en cada operación qué puede
fallar y con qué código se responde, que es exactamente lo que el ejercicio quiere que se
vea.
