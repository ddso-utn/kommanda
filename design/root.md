# Kommanda — Diagrama de responsabilidades de componentes

## Scope

Kommanda es el backend de gestión de pedidos de un restaurante: mantiene el menú de
platos y las comandas abiertas por mesa, y expone ambas cosas como una API REST sobre
HTTP. El sistema conoce qué platos existen, qué pidió cada mesa, qué está listo y en qué
estado avanza cada comanda.

El documento describe el backend y nada más. No dice nada sobre clientes, autenticación,
usuarios, roles, impresión en cocina, facturación ni despliegue. Tampoco describe el
esquema físico de MongoDB más allá de lo que los componentes de persistencia necesitan
para traducir entre documentos y objetos de dominio.

El sistema está dividido **por capas**, que es como el código está organizado.

## Component diagram

```mermaid
flowchart TD
  OP[Operador]:::externo
  CL[Cliente HTTP]:::externo
  AR[Arranque]
  API[API HTTP]
  SRV[Servicios]
  PER[Persistencia]
  DOM[Dominio]
  DB[(MongoDB)]:::externo

  OP -->|"[node index.js]<br/>levanta el proceso"| AR
  AR -->|"[connectToDB(dbUri)]<br/>abre y verifica la conexión al cluster"| DB
  AR -->|"[startServer(app, port, appContext)]<br/>monta middleware, Swagger y rutas"| API
  CL -->|"[POST /platos, GET /comandas, ...]<br/>pide operaciones sobre el menú y las comandas"| API
  API -->|"[agregarPlato(datosPlato)]<br/>delega la lógica de negocio"| SRV
  API -->|"[obtenerPlatoPorId(id)], [listar()], [guardarPlato(platoActualizado)], [obtenerPorId(id)]<br/>lee y guarda directo, salteando el servicio"| PER
  API -->|"[estado()], [Categoria.fromString(token)]<br/>lee el estado calculado y traduce la categoría del body"| DOM
  SRV -->|"[guardarPlato(platoActualizado)], [agregarComanda(comanda)]<br/>persiste lo que el dominio produjo o modificó"| PER
  SRV -->|"[new Comanda(mesa, platos)], [actualizar(actualizaciones)]<br/>construye y opera los objetos de dominio"| DOM
  PER -->|"[new Plato(args)] sin argumentos, [Categoria.fromString(token)]<br/>reconstruye los objetos de dominio desde los documentos"| DOM
  PER -->|"[insertOne(doc)], [find()], [aggregate(pipeline)]<br/>lee y escribe documentos"| DB

  classDef externo stroke-dasharray: 5 5
```

## Components

| Módulo | Responsabilidad | Estado | Interfacing points |
|---|---|---|---|
| **Arranque** ([index.js](../index.js), [src/app/db.js](../src/app/db.js), [src/app/context.js](../src/app/context.js)) | Poner el sistema en pie: abrir la conexión a MongoDB, instanciar cada componente con sus dependencias ya resueltas, y entregarle ese grafo al servidor. | El `MongoClient` conectado y el contexto de la aplicación — la única instancia de cada repositorio, servicio y controlador. | `connectToDB(dbUri)`, `buildAppContext(DB_CLIENT)` |
| **API HTTP** ([src/app/server.js](../src/app/server.js), [src/app/routes.js](../src/app/routes.js), [src/controllers/](../src/controllers/)) | Traducir entre HTTP y el resto del sistema: parsear la request, invocar la operación que corresponde, mapear objetos de dominio a JSON y excepciones de dominio a códigos de estado. | La aplicación Express con sus rutas montadas, y en cada controlador la referencia al servicio y al repositorio que usa. | Hacia el cliente, las once rutas HTTP de la tabla de [Ruteo](api-http.md#configureroutesapp-appcontext). Hacia adentro, `startServer(app, port, appContext)`, `new PlatosController(platosService, menu)`, `new ComandaController(comandaService, comandaRepository)`. |
| **Servicios** ([src/services/](../src/services/)) | Orquestar los casos de negocio que involucran más de un paso: resolver los platos del menú que una comanda referencia, construir los objetos de dominio, pedirle al dominio que se modifique y mandar a persistir el resultado. | Ninguno propio — sólo las referencias a los repositorios que necesita. | `new PlatosService(menu)`, `new ComandaService(comandaRepository, menu)`, `PlatosService.agregarPlato(datosPlato)`, `PlatosService.actualizarPlato(platoId, actualizaciones)`, `ComandaService.crearComanda(mesa, platos)`, `ComandaService.agregarPlatoComanda(idComanda, datosPlato)`, `ComandaService.actualizarBebidasComanda(idComanda, bebidasListas)`, `ComandaService.actualizarPlatoComanda(idComanda, actualizacionesPlato, ordenPlato)` |
| **Persistencia** ([src/repositories/](../src/repositories/)) | Ser el dueño de las colecciones de MongoDB y la única frontera donde un objeto de dominio se convierte en documento y viceversa. Nadie fuera de este módulo ve un `_id`, un `ObjectId` ni un pipeline de agregación. | Las colecciones `platos` y `comandas`. | `new Menu(db)`, `new ComandaRepository(db, menu)`, `Menu.agregarPlato(plato)`, `Menu.listar()`, `Menu.obtenerPlatoPorId(id)`, `Menu.guardarPlato(platoActualizado)`, `ComandaRepository.agregarComanda(comanda)`, `ComandaRepository.obtenerPorId(id)`, `ComandaRepository.listarPorFlags(platosPendientes, bebidasPendientes)` |
| **Dominio** ([src/domain/](../src/domain/), [src/excepciones/](../src/excepciones/)) | Modelar el negocio del restaurante y ser el dueño de sus reglas: qué es un plato válido, qué categorías existen y en qué orden se sirven, qué platos tiene una comanda, cuáles están listos, en qué estado está la comanda y cuánto suma la cuenta. | Cada instancia tiene el suyo: un `Plato` su nombre, categoría, precio y disponibilidad; una `Comanda` su mesa, sus `PlatoPedido`, si las bebidas están listas y si está pagada. | `new Plato(args)`, `Plato.actualizar(actualizaciones)`, `Plato.esDeCategoria(categoria)`, `Categoria.fromString(token)`, `new Comanda(mesa, platos)`, `Comanda.agregarPlato(plato)`, `Comanda.agregarNotas(ordenPlato, notas)`, `Comanda.asignarCantidad(ordenPlato, cantidad)`, `Comanda.marcarListo(ordenPlato, estaListo)`, `Comanda.marcarBebidasListas(bebidasListas)`, `Comanda.estado()`, `Comanda.bebidasPendientes()`, `Comanda.platosPendientes()`, `Comanda.totalAPagar()`, `new PlatoPedido(plato, cantidad, notas)` |

Cada módulo tiene su propio documento: [Arranque](arranque.md) ·
[API HTTP](api-http.md) · [Servicios](servicios.md) · [Persistencia](persistencia.md) ·
[Dominio](dominio.md).

## Use cases

### Arranque de la aplicación

Un operador levanta el proceso. El módulo Arranque conecta con MongoDB, arma el grafo de
objetos y se lo pasa al servidor, que queda escuchando.

```mermaid
sequenceDiagram
  box transparent fuera del sistema
    participant OP as Operador
    participant DB as MongoDB
  end
  box Kommanda
    participant AR as Arranque
    participant API as API HTTP
  end

  OP->>AR: [node index.js] levanta el proceso
  AR->>DB: [connectToDB(dbUri)] conecta y hace ping
  DB-->>AR: MongoClient conectado
  AR->>AR: [buildAppContext(DB_CLIENT)] instancia repositorios, servicios y controladores
  AR->>API: [startServer(app, port, appContext)] monta body-parser, Swagger y las rutas
  API-->>OP: servidor escuchando en el puerto 3000
```

### Alta de un plato en el menú

```mermaid
sequenceDiagram
  box transparent fuera del sistema
    participant CL as Cliente HTTP
    participant DB as MongoDB
  end
  box Kommanda
    participant API as API HTTP
    participant SRV as Servicios
    participant DOM as Dominio
    participant PER as Persistencia
  end

  CL->>API: [POST /platos] envía nombre, categoría y precio
  API->>DOM: [Categoria.fromString(token)] traduce el nombre de categoría del body
  API->>SRV: [agregarPlato(datosPlato)] pide dar de alta el plato
  SRV->>DOM: [new Plato(args)] construye y valida
  alt falta nombre, categoría o precio
    DOM-->>SRV: lanza PlatoInvalido
    SRV-->>API: propaga PlatoInvalido
    API-->>CL: 400 con el mensaje del error
  else datos completos
    DOM-->>SRV: Plato disponible
    SRV->>PER: [agregarPlato(plato)] pide persistirlo
    PER->>DB: [insertOne(platoDB)] inserta el documento
    DB-->>PER: insertedId
    PER-->>SRV: Plato con su id asignado
    SRV-->>API: Plato
    API-->>CL: 201 con el plato serializado
  end
```

### Consulta del menú

```mermaid
sequenceDiagram
  box transparent fuera del sistema
    participant CL as Cliente HTTP
    participant DB as MongoDB
  end
  box Kommanda
    participant API as API HTTP
    participant PER as Persistencia
    participant DOM as Dominio
  end

  CL->>API: [GET /platos] pide el menú completo
  API->>PER: [listar()] pide todos los platos
  PER->>DB: [find()] lee la colección platos
  DB-->>PER: cursor de documentos
  loop por cada documento
    PER->>DOM: [new Plato(args)] sin argumentos y [Categoria.fromString(token)] reconstruye el plato
    DOM-->>PER: Plato
  end
  PER-->>API: lista de Plato
  API-->>CL: 200 con la lista serializada
```

### Consulta de un plato

```mermaid
sequenceDiagram
  box transparent fuera del sistema
    participant CL as Cliente HTTP
    participant DB as MongoDB
  end
  box Kommanda
    participant API as API HTTP
    participant PER as Persistencia
    participant DOM as Dominio
  end

  CL->>API: [GET /platos/:id] pide un plato puntual
  API->>PER: [obtenerPlatoPorId(id)] pide el plato
  PER->>DB: [findOne({_id})] busca el documento
  alt no hay documento
    DB-->>PER: null
    PER-->>API: lanza PlatoInexistente
    API-->>CL: 404 con el mensaje del error
  else existe
    DB-->>PER: documento
    PER->>DOM: [new Plato(args)] sin argumentos reconstruye el plato
    DOM-->>PER: Plato
    PER-->>API: Plato
    API-->>CL: 200 con el plato serializado
  end
```

### Modificación de un plato

```mermaid
sequenceDiagram
  box transparent fuera del sistema
    participant CL as Cliente HTTP
    participant DB as MongoDB
  end
  box Kommanda
    participant API as API HTTP
    participant SRV as Servicios
    participant PER as Persistencia
    participant DOM as Dominio
  end

  CL->>API: [PUT /platos/:id] envía los campos a cambiar
  API->>DOM: [Categoria.fromString(token)] traduce la categoría si vino
  API->>SRV: [actualizarPlato(platoId, actualizaciones)] pide aplicar los cambios
  SRV->>PER: [obtenerPlatoPorId(platoId)] trae el plato actual
  alt no existe
    PER-->>SRV: lanza PlatoInexistente
    SRV-->>API: propaga PlatoInexistente
    API-->>CL: 404 con el mensaje del error
  else existe
    PER-->>SRV: Plato
    SRV->>DOM: [actualizar(actualizaciones)] aplica sólo los campos presentes
    SRV->>PER: [guardarPlato(platoActualizado)] persiste el plato modificado
    PER->>DB: [updateOne({_id}, {$set})] escribe el documento
    PER-->>SRV: Plato actualizado
    SRV-->>API: Plato actualizado
    API-->>CL: 200 con el plato serializado
  end
```

### Cambio de disponibilidad de un plato

```mermaid
sequenceDiagram
  box transparent fuera del sistema
    participant CL as Cliente HTTP
    participant DB as MongoDB
  end
  box Kommanda
    participant API as API HTTP
    participant PER as Persistencia
    participant DOM as Dominio
  end

  CL->>API: [PATCH /platos/:id] pide fijar o invertir la disponibilidad
  API->>PER: [obtenerPlatoPorId(id)] trae el plato
  alt no existe
    PER-->>API: lanza PlatoInexistente
    API-->>CL: 404 con el mensaje del error
  else existe
    PER-->>API: Plato
    API->>DOM: [estaDisponible = valor ?? !estaDisponible] asigna el campo sin una operación del dominio que lo cubra
    API->>PER: [guardarPlato(platoActualizado)] persiste el cambio
    PER->>DB: [updateOne({_id}, {$set})] escribe el documento
    PER-->>API: Plato actualizado
    API-->>CL: 200 con el plato serializado
  end
```

### Apertura de una comanda

```mermaid
sequenceDiagram
  box transparent fuera del sistema
    participant CL as Cliente HTTP
    participant DB as MongoDB
  end
  box Kommanda
    participant API as API HTTP
    participant SRV as Servicios
    participant PER as Persistencia
    participant DOM as Dominio
  end

  CL->>API: [POST /comandas] envía la mesa y los platos pedidos
  API->>SRV: [crearComanda(mesa, platos)] pide abrir la comanda
  loop por cada plato pedido
    SRV->>PER: [obtenerPlatoPorId(p.idPlato)] resuelve el plato del menú
    alt el plato no existe
      PER-->>SRV: lanza PlatoInexistente
      SRV-->>API: propaga PlatoInexistente
      API-->>CL: 400 con el mensaje del error
    else existe
      PER-->>SRV: Plato
      SRV->>DOM: [new PlatoPedido(plato, cantidad, notas)] arma la línea del pedido
    end
  end
  SRV->>DOM: [new Comanda(mesa, platosPedidos)] construye la comanda
  DOM-->>SRV: Comanda sin bebidas listas y sin pagar
  SRV->>PER: [agregarComanda(comanda)] persiste la comanda
  PER->>DB: [insertOne(comandaDB)] inserta el documento
  DB-->>PER: insertedId
  PER-->>SRV: Comanda con su id asignado
  SRV-->>API: Comanda
  API->>DOM: [estado()] calcula el estado para la respuesta
  DOM-->>API: EstadoComanda
  API-->>CL: 201 con la comanda serializada
```

### Consulta de una comanda

```mermaid
sequenceDiagram
  box transparent fuera del sistema
    participant CL as Cliente HTTP
    participant DB as MongoDB
  end
  box Kommanda
    participant API as API HTTP
    participant PER as Persistencia
    participant DOM as Dominio
  end

  CL->>API: [GET /comandas/:id] pide una comanda puntual
  API->>PER: [obtenerPorId(id)] pide la comanda
  PER->>DB: [findOne({_id})] busca el documento
  alt no hay documento
    DB-->>PER: null
    PER-->>API: lanza ComandaInexistente
    API-->>CL: 404 con el mensaje del error
  else existe
    DB-->>PER: documento con los idPlato de cada línea
    loop por cada plato pedido
      PER->>PER: [obtenerPlatoPorId(idPlato)] resuelve el plato del menú, una consulta por línea
      PER->>DOM: [new PlatoPedido(plato, cantidad, notas)] sin argumentos reconstruye la línea
    end
    PER->>DOM: [new Comanda(mesa, platos)] sin argumentos reconstruye la comanda
    PER-->>API: Comanda
    API->>DOM: [estado()] calcula el estado para la respuesta
    DOM-->>API: EstadoComanda
    API-->>CL: 200 con la comanda serializada
  end
```

### Agregado de un plato a una comanda

```mermaid
sequenceDiagram
  box transparent fuera del sistema
    participant CL as Cliente HTTP
  end
  box Kommanda
    participant API as API HTTP
    participant SRV as Servicios
    participant PER as Persistencia
    participant DOM as Dominio
  end

  CL->>API: [POST /comandas/:id/platos] envía el plato a agregar
  API->>SRV: [agregarPlatoComanda(idComanda, datosPlato)] pide sumarlo a la comanda
  SRV->>PER: [obtenerPorId(idComanda)] trae la comanda
  alt la comanda no existe
    PER-->>SRV: lanza ComandaInexistente
    SRV-->>API: propaga ComandaInexistente
    API-->>CL: ninguna respuesta - la excepción se loguea y la request queda abierta
  else el plato del menú no existe
    PER-->>SRV: lanza PlatoInexistente
    SRV-->>API: propaga PlatoInexistente
    API-->>CL: 400 con el mensaje del error
  else ambos existen
    PER-->>SRV: Comanda
    SRV->>PER: [obtenerPlatoPorId(datosPlato.idPlato)] resuelve el plato del menú
    PER-->>SRV: Plato
    SRV->>DOM: [new PlatoPedido(plato, cantidad, notas)] arma la línea
    SRV->>DOM: [agregarPlato(platoPedido)] la suma a la comanda
    SRV-->>API: Comanda modificada en memoria, sin persistir
    API->>DOM: [estado()] calcula el estado para la respuesta
    API-->>CL: 200 con la comanda serializada
  end
```

### Marcado de bebidas listas

```mermaid
sequenceDiagram
  box transparent fuera del sistema
    participant CL as Cliente HTTP
  end
  box Kommanda
    participant API as API HTTP
    participant SRV as Servicios
    participant PER as Persistencia
    participant DOM as Dominio
  end

  CL->>API: [PATCH /comandas/:id] envía bebidasListas
  API->>SRV: [actualizarBebidasComanda(idComanda, bebidasListas)] pide marcarlas
  SRV->>PER: [obtenerPorId(idComanda)] trae la comanda
  alt no existe
    PER-->>SRV: lanza ComandaInexistente
    SRV-->>API: propaga ComandaInexistente
    API-->>CL: ninguna respuesta - la excepción se loguea y la request queda abierta
  else existe
    PER-->>SRV: Comanda
    SRV->>DOM: [marcarBebidasListas(bebidasListas)] fija el flag
    SRV-->>API: Comanda modificada en memoria, sin persistir
    API->>DOM: [estado()] calcula el estado para la respuesta
    API-->>CL: 200 con la comanda serializada
  end
```

### Actualización de un plato pedido

```mermaid
sequenceDiagram
  box transparent fuera del sistema
    participant CL as Cliente HTTP
  end
  box Kommanda
    participant API as API HTTP
    participant SRV as Servicios
    participant PER as Persistencia
    participant DOM as Dominio
  end

  CL->>API: [PATCH /comandas/:id/platos/:ordenPlato] envía notas, cantidad o estaListo
  API->>SRV: [actualizarPlatoComanda(idComanda, actualizacionesPlato, ordenPlato)] pide aplicarlos
  SRV->>PER: [obtenerPorId(idComanda)] trae la comanda
  alt no existe
    PER-->>SRV: lanza ComandaInexistente
    SRV-->>API: propaga ComandaInexistente
    API-->>CL: 404 con el mensaje del error
  else existe
    PER-->>SRV: Comanda
    opt vienen notas
      SRV->>DOM: [agregarNotas(ordenPlato, notas)] las asigna a la línea
    end
    opt viene cantidad
      SRV->>DOM: [asignarCantidad(ordenPlato, cantidad)] la asigna a la línea
    end
    opt viene estaListo
      SRV->>DOM: [marcarListo(ordenPlato, estaListo)] marca la línea como lista
    end
    SRV-->>API: Comanda modificada en memoria, sin persistir
    API->>DOM: [estado()] recalcula el estado a partir de las categorías listas
    DOM-->>API: EstadoComanda
    API-->>CL: 200 con la comanda serializada
  end
```

### Búsqueda de comandas pendientes

```mermaid
sequenceDiagram
  box transparent fuera del sistema
    participant CL as Cliente HTTP
    participant DB as MongoDB
  end
  box Kommanda
    participant API as API HTTP
    participant PER as Persistencia
    participant DOM as Dominio
  end

  CL->>API: [GET /comandas?bebidasPendientes&platosPendientes] pide las comandas que filtran
  API->>PER: [listarPorFlags(platosPendientes, bebidasPendientes)] pide la búsqueda
  PER->>DB: [aggregate(pipeline)] filtra por bebidasListas y hace lookup contra platos
  DB-->>PER: documentos con sus platos resueltos
  loop por cada documento
    PER->>DOM: [new Plato(args)], [new PlatoPedido(plato, cantidad, notas)] y [new Comanda(mesa, platos)] sin argumentos reconstruye la comanda entera
  end
  PER-->>API: lista de Comanda
  API->>DOM: [estado()] calcula el estado de cada una
  API-->>CL: 200 con la lista serializada
```

## Rejected alternatives

**Dividir el sistema por subdominio en vez de por capa.** Un corte en Menú y Comandas
daría tres módulos con estado propio en vez de uno sin estado, pero escondería dentro de
cada módulo la dirección de las dependencias, que es justamente la propiedad que este
documento existe para hacer verificable.

**Que los controladores hablen directo con MongoDB.** Concentrar el marshalling en
Persistencia es lo que permite que ni el dominio ni los servicios conozcan `ObjectId`,
`_id` ni la forma de los documentos. Cambiar de motor de base toca un solo módulo.

**Un dominio anémico, con los datos separados de las reglas.** `Comanda` calcula su propio
estado y `Plato` valida su propia construcción, así que ningún camino del sistema puede
producir un objeto inválido ni un estado inconsistente — ni siquiera uno que saltee los
servicios.
