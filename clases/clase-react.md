# Clase React — Frontend con React

Punto de partida: `clase-odm/4-repo-comandas` (API completa con persistencia en MongoDB).

En esta clase se agrega un frontend React al proyecto, incorporando la estructura de monorepo (`backend/` + `frontend/`). Se parte de una pantalla estática y se construye progresivamente: componentización, estado local, comunicación con la API mock y finalmente carga asincrónica de datos.

---

## `clase-react/base`

Reestructuración del repositorio para alojar dos proyectos: el backend Express existente se mueve a `backend/`, y se incorpora la aplicación React inicial en `frontend/`.

- El `frontend/` es una app Create React App que muestra una lista de productos de ropa (el dominio original del proyecto base)
- El `backend/` contiene todo el código de las clases anteriores sin modificaciones
- A partir de aquí todas las clases de React trabajan exclusivamente sobre `frontend/`

---

## `clase-react/1-separando-componentes`

Se refactoriza la pantalla principal para extraer componentes reutilizables. El punto de partida tiene todo el HTML hardcodeado inline en un único componente.

- Se extrae `NavBar` para el encabezado con logo y slogan
- Se extrae `Titulo` para el título de sección
- Se extrae `CardPlato` para la tarjeta individual de cada plato
- Se extrae `ListaPlatos` que mapea la lista de datos a tarjetas
- Los datos de los platos pasan de 12 cards idénticas de "Pizza" a una constante `PLATOS` con nombres, imágenes y precios reales

---

## `clase-react/2-estado-local`

Se introduce `useState` para registrar qué platos seleccionó el usuario antes de armar la comanda.

- `CardPlato` incorpora un estado local `seleccionado` con `useState`
- Al hacer click en una tarjeta se alterna su estado y se aplica la clase CSS `selected` para feedback visual
- Se agrega un botón "Agregar a comanda" con su función `agregarAComanda` que por ahora solo loguea los platos seleccionados

---

## `clase-react/3-agregando-a-comanda`

Se conecta el botón de la comanda con la API mock y se corrigen detalles del modelo de datos.

- Se agrega un campo `id` numérico a cada plato de la constante `PLATOS`
- Se corrige `new Promise.resolve()` → `Promise.resolve()` en `api.js`
- `agregarAComanda` pasa a ser `async` y llama a `putCommanda` de la API mock; muestra un alert de confirmación con la cantidad de platos agregados

---

## `clase-react/4-levantando-estado`

Se sube el estado de selección desde `CardPlato` hacia `Home` (lifting state up), para que el componente padre controle qué platos están seleccionados y pueda pasarlos a `agregarAComanda`.

- El estado `seleccionado` sale de `CardPlato`; ahora `Home` mantiene la lista completa de platos con su flag de selección
- `CardPlato` pasa a ser un componente controlado: recibe `seleccionado` y `alSeleccionarPlato` como props
- `ListaPlatos` recibe `platos` y `cambiarSeleccionPlato` como props y los delega a cada tarjeta
- `agregarAComanda` en `Home` puede ahora filtrar `platos.filter(p => p.seleccionado)` correctamente
- Se corrige `<navbar>` por `<nav>` (elemento HTML semánticamente correcto)

**Variante:** `clase-react/4-levantando-estado-dos-arrays` (rama hermana, parte de `clase-react/3-agregando-a-comanda`) resuelve el mismo problema de otra forma: en vez de un único array `platos` con un flag `seleccionado` por elemento, mantiene dos arrays separados — `todosLosPlatos` (fijo) y `platosSeleccionados` (los elegidos). El estado de selección de cada plato se deriva con `platosSeleccionados.includes(plato)` en vez de leer un flag. Útil para mostrar a los estudiantes que ambos modelos de datos son válidos y discutir sus tradeoffs (comparar por referencia vs. por flag, simplicidad de armar la comanda vs. necesidad de recorrer dos arrays).

---

## `clase-react/5-cargando-platos`

Se reemplaza la lista hardcodeada por una carga asincrónica desde la API, introduciendo `useEffect` y el patrón de carga con estado vacío inicial.

- La constante `PLATOS` desaparece del componente; el estado inicial es un array vacío `[]`
- `useEffect` dispara una función async `cargarPlatos` al montar el componente, que llama a `getPlatos()` de la API mock y actualiza el estado
- Mientras los datos no llegan se muestra `"Cargando..."` (renderizado condicional)
- `getPlatos` pasa a devolver objetos con `id` para que el estado de selección funcione igual que antes

---

## `clase-react/6-agregando-bebidas`

Se agrega una segunda entidad, Bebidas, duplicando deliberadamente el patrón ya conocido de Platos (mismo `useEffect` + fetch + selección). El HomePage se renombra a `Platos`.

- Nuevo componente `Bebidas` en `features/bebidas/bebidas.js`, copia casi literal de `Platos`
- Se activa el React Router que ya existía en el proyecto base pero no se usaba: rutas `/platos` y `/bebidas`
- El `NavBar` se extrae a un componente compartido en `components/navbar/Navbar.js`, usado por un nuevo `Layout` con `<Outlet/>`
- La duplicación es intencional: sienta la base para la lección de "lift state up" que sigue

---

## `clase-react/7-notas-en-platos`

Se agrega un campo de texto "Notas" por plato, para que el cliente pueda aclarar preferencias (sin cebolla, bien cocido, etc.).

- `CardPlato` recibe `notas` y `alCambiarNotas` como props, con un `<input>` controlado
- `Platos` mantiene `cambiarNotasPlato`, que actualiza el plato correspondiente inmutablemente
- El log de "agregar a comanda" incluye las notas de cada plato seleccionado

---

## `clase-react/8-comanda-con-routing`

Se levanta el estado de platos desde `Platos` hacia `App`, y en lugar de un `alert` al agregar a la comanda, se navega a una nueva pantalla `/comanda`.

- `App` pasa a cargar los platos (`useEffect` + `getPlatos`) y se los pasa a `Platos` por props junto con `alAgregarAComanda`
- Nuevo `features/pedido/comanda.js`: pantalla `Comanda` que lista los elementos pedidos
- `Platos` usa `useNavigate` para ir a `/comanda` después de agregar, en vez de mostrar un alert
- Nota: el proyecto exploró brevemente otra alternativa (levantar el estado de Platos y Bebidas juntos con un botón "reiniciar pedido"), pero se descartó a favor de este enfoque con ruta dedicada de comanda

---

## `clase-react/9-comanda-con-bebidas`

Se extiende el patrón anterior a Bebidas: ambas entidades levantan su estado a `App`, y la comanda acumula platos y bebidas.

- `App` ahora carga y mantiene tanto `platos` como `bebidas`, cada uno con su `useEffect`
- El flujo de navegación queda: `/platos` → `/bebidas` → `/comanda`
- `Comanda` muestra la unión de `comanda.platos` y `comanda.bebidas`

---

## `clase-react/10-api-real`

Se reemplaza el módulo de datos mock local por una API mock real externa, usando `axios`.

- Se agrega la dependencia `axios`
- `cargarPlatos` en `App` pasa a hacer `axios.get(...)` contra un endpoint de mockapi.io en vez de llamar a la función local `getPlatos`
- Nota: esto crea una dependencia de la clase con un servicio de terceros (mockapi.io) — vale la pena considerar self-hostear este mock más adelante para no depender de su disponibilidad

---

## `clase-react/11-imagenes-separadas`

El fetch de platos se separa en dos llamadas independientes que se combinan en el cliente.

- Una llamada trae los datos base de cada plato (`platos-base`), otra trae el mapa de imágenes (`images`)
- Se combinan con `platos.map(p => ({...p, imagen: imagenes[0][p.id]}))`

---

## `clase-react/12-banner`

Se agrega un mensaje promocional (banner) que se carga desde otro endpoint y se muestra en la pantalla de Platos.

- Nuevo estado `banner` en `App`, cargado con una tercera llamada a `axios`
- `Platos` recibe `banner` como prop y lo renderiza arriba de la lista

---

## `clase-react/13-estado-de-carga`

Se introduce un estado de carga explícito (`platosLoading`), en vez de inferir "está cargando" a partir de `platos.length === 0`.

- `setPlatosLoading(true)` al iniciar la carga, `setPlatosLoading(false)` al terminar
- La ruta `/platos` usa `platosLoading` para decidir si mostrar `"Cargando..."` o el componente `Platos`

---

## `clase-react/14-manejo-de-errores`

Se envuelve la carga de platos en un `try/catch` y se introduce un estado de error visible para el usuario.

- Nuevo estado `errorPlatos`, seteado en el `catch`
- `Platos` recibe `error` como prop; si está presente, muestra un mensaje en rojo en vez de la lista
- Se agrega la clase CSS `.error` para el estilo del mensaje

---

## `clase-react/15-context-api`

Refactor grande: toda la lógica de estado que vivía en `App` se extrae a React Context, para evitar seguir pasando props manualmente a través de múltiples niveles.

- Nuevos providers: `PlatosProvider`, `BebidasProvider`, `ComandaProvider`, cada uno en su propio archivo dentro de `context/`
- Nuevo `routes.js` con el `AppRoutes` que antes vivía en `App.js`
- `App.js` queda reducido a anidar los tres providers alrededor de `AppRoutes`
- `Platos` y `Bebidas` leen del contexto con `useContext` en vez de recibir todo por props
- Se limpian imports muertos que quedaron de la refactorización (funciones de fetch directo, componentes no usados)

---

## `clase-react/16-separando-api`

Se extraen las llamadas a la API a un módulo propio, separando la responsabilidad de "hacer fetch" de la de "manejar estado".

- `mockData/api.js` se renombra a `api/api.js`
- Nuevo `api/platos.js`: concentra `getPlatosFromApi` y `getBanner`, encapsulando las llamadas a axios que antes vivían directamente en `platosProvider.js`
- `platosProvider.js` pasa a llamar a estas funciones en vez de hacer `axios.get` directamente

---

**Nota sobre el resto del frontend original:** el proyecto fuente (`esto-es-happy-new-year`) tenía además una rama `komm-15` que empezaba a migrar `PlatosProvider` de `useState` a `useReducer`. Se decidió no incorporarla a esta clase: además de partir de un punto anterior a `komm-14` (perdía la separación de API), el código quedó a medio migrar y no compila (llama a setters que ya no existen). Queda como posible lección futura, a escribir de cero y de forma completa.
