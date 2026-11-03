# Clase 2 de Frontend: soluciones

Explicación de cómo se resolvió cada paso de los [enunciados](enunciados.md).

---

## Paso 1: Repaso de la selección de platos

Ramas: [`clase-react/4-levantando-estado-dos-arrays`](https://github.com/ddso-utn/kommanda/tree/clase-react/4-levantando-estado-dos-arrays) y [`clase-react/4-levantando-estado`](https://github.com/ddso-utn/kommanda/tree/clase-react/4-levantando-estado)

Este paso ya se vio en la clase anterior; acá lo repasamos.

El problema es que el estado de selección vive en cada `CardPlato`, pero quien necesita saber qué platos están seleccionados es `Home`, que es quien arma la comanda. La solución es subir el estado al componente padre: `Home` guarda qué está seleccionado y cada `CardPlato` pasa a recibir `seleccionado` y `alSeleccionarPlato` por props.

**Idea clave: subir el estado** (en inglés, *lifting state up*). Flux, el modelo en el que se basa React, propone una jerarquía en forma de árbol: el estado baja de padres a hijos. Entonces, cuando dos componentes necesitan compartir un estado, ese estado se sube tan arriba como haga falta para que un ancestro común de los dos lo tenga y se lo pase a cada uno.

Hay dos formas de modelar ese estado en `Home`:

**Con dos arrays.** `todosLosPlatos` tiene la lista fija y `platosSeleccionados` tiene los elegidos. Para saber si un plato está seleccionado se pregunta `platosSeleccionados.includes(plato)`. Armar la comanda es directo: ya tenemos el array de seleccionados.

**Con un flag en cada plato.** Hay un solo array `platos`, y cada plato tiene un campo `seleccionado`. Para armar la comanda se filtra: `platos.filter(p => p.seleccionado)`.

Las dos son válidas.

Un detalle que aparece en las dos: si el estado de selección se queda en `CardPlato`, al enviar la comanda los platos siguen marcados, porque `Home` no tiene forma de resetearlos. Es otra razón para subir el estado.

---

## Paso 2: ¿De dónde salen los platos?

Rama: [`clase-react/5-cargando-platos`](https://github.com/ddso-utn/kommanda/tree/clase-react/5-cargando-platos)

### Efectos de lado

Un componente de React es, en principio, una función pura: recibe props y estado y devuelve lo que hay que mostrar. Pero los programas reales necesitan hacer cosas que rompen esa idea, porque dependen del mundo externo o lo modifican:

- Hablar con un servidor.
- Usar librerías externas (por ejemplo, un SDK como el de Amazon Connect).
- Tocar partes del navegador que están fuera de lo que React maneja: `document`, `window`, un `<video>`, mostrar un `confirm`.

Si esas cosas pasan como respuesta a un evento (un click, un submit), las resuelve el manejador del evento. ¿Y si no hay evento? Por ejemplo, cargar los platos cuando se muestra la pantalla.

Cada framework lo resuelve a su manera:

- **Ciclo de vida**: métodos que se llaman en momentos fijos, como al montar, al actualizar o al destruir el componente.
- **Efectos**: código que se ejecuta después de cada render y que puede hacer cualquier cosa.

### `useEffect`

React usa efectos, con `useEffect`:

- Recibe una función que se ejecuta cuando termina cada render.
- La idea es que el efecto sincroniza algo externo con el estado de la aplicación. Se lo puede pensar casi como un resultado más del componente: además de lo que se muestra, está lo que se tiene que hacer afuera.
- Si el efecto no debería correr siempre, se le pasa una lista de dependencias: solo vuelve a correr cuando alguna cambia. Con `[]` corre una sola vez, al montar el componente.
- En teoría los efectos podrían correr siempre. Pero como actúan sobre el mundo externo, correrlos de más puede ser un problema: por ejemplo, llamar varias veces a un endpoint que no es idempotente.
- Si varios eventos tienen el mismo efecto, puede tener sentido desacoplar el efecto de los eventos en vez de repetirlo en cada manejador.

Los efectos con dependencias son un tema un poco más complicado, que vamos a ver más adelante. Por ahora alcanza con `[]`.

### En Kommanda

- La constante `PLATOS` sale del componente. El estado arranca como un array vacío.
- Un `useEffect` con `[]` llama a `getPlatos()` al montar y guarda el resultado en el estado.
- Mientras el array está vacío, se muestra "Cargando...".

```js
const [platos, setPlatos] = useState([])

useEffect(() => {
  const cargarPlatos = async () => setPlatos(await getPlatos())
  cargarPlatos()
}, [])
```

La función que recibe `useEffect` no puede ser `async`, por eso se define `cargarPlatos` adentro y se la llama.

---

## Paso 3: Notas en los platos

Rama: [`clase-react/7-notas-en-platos`](https://github.com/ddso-utn/kommanda/tree/clase-react/7-notas-en-platos) · [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/6-agregando-bebidas...clase-react/7-notas-en-platos)

Es un paso corto para practicar inputs controlados. La rama de partida ya trae la página de bebidas y el router, que se usan más adelante.

- `CardPlato` recibe `notas` y `alCambiarNotas` por props y muestra un `<input>` controlado: su `value` es `notas` y su `onChange` llama a `alCambiarNotas`.
- `Platos` define `cambiarNotasPlato(idPlato, notas)`, que actualiza solo el plato correspondiente sin modificar el original: crea un plato nuevo con `{...plato, notas}`.
- `ListaPlatos` recibe `cambiarNotasPlato` y se lo pasa a cada tarjeta.
- Como las notas quedan guardadas en el mismo plato, viajan solas cuando se filtran los seleccionados para la comanda.

**Idea clave: capturar el evento correcto.** Para enterarse de lo que escribe el usuario hay que pensar en eventos: ¿qué evento ocurre cuando escribe? En un input, es `onChange`, que se dispara cada vez que cambia el texto.

**Idea clave: lo que se muestra es función del estado.** Para que el input muestre lo que escribe el usuario, ese valor tiene que estar en el estado, y hay que actualizar el estado cada vez que ocurre el `onChange`. Así el componente se vuelve a dibujar con el valor nuevo.

Y como la nota la necesita quien arma la comanda, no puede quedarse en `CardPlato`: se guarda en el plato, en el estado de `Platos`. Es lo mismo que se hizo con `seleccionado` en el paso 1: subir el estado.

---

## Paso 4: La comanda en una pantalla aparte

Rama: [`clase-react/8-comanda-con-routing`](https://github.com/ddso-utn/kommanda/tree/clase-react/8-comanda-con-routing) · [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/7-notas-en-platos...clase-react/8-comanda-con-routing)

**Idea clave: otra vez, subir el estado.** La pantalla `/comanda` necesita los platos que se eligieron en `/platos`. En el árbol de componentes, `Platos` y `Comanda` están a la misma altura, así que uno no le puede pasar props al otro. Siguiendo la idea del paso 1, el estado se sube a un ancestro común de los dos, que es `App`, y desde ahí se les pasa a cada uno.

- `App` carga los platos (con el mismo `useEffect` de antes) y guarda la comanda en su estado.
- `App` le pasa a `Platos` la lista (`todosLosPlatos`) y una función `alAgregarAComanda`, que guarda los platos elegidos en la comanda.
- Nuevo componente `Comanda` en `features/pedido/comanda.js`, que recibe los elementos pedidos y los lista.
- Nueva ruta `/comanda` que muestra `Comanda`.
- `Platos`, en vez de mostrar el `alert`, llama a `alAgregarAComanda` y navega con `useNavigate`.
- Ahora que `App` conoce los platos, también se los puede pasar al `Layout` para mostrar la cantidad en el slogan.

---

## Paso 5: Bebidas en la comanda

Rama: [`clase-react/9-comanda-con-bebidas`](https://github.com/ddso-utn/kommanda/tree/clase-react/9-comanda-con-bebidas) · [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/8-comanda-con-routing...clase-react/9-comanda-con-bebidas)

Es el mismo patrón del paso anterior, aplicado a las bebidas.

- `App` carga y guarda tanto `platos` como `bebidas`, cada uno con su `useEffect`.
- La comanda pasa a tener `platos` y `bebidas`.
- El recorrido queda: `/platos` → `/bebidas` → `/comanda`.
- `Comanda` muestra platos y bebidas juntos.
- "Cargando..." pasa a decidirse en las rutas de `App`, y se borra el `useEffect` que había quedado en `Platos`.

---

## Paso 6: Una API de verdad

Rama: [`clase-react/10-api-real`](https://github.com/ddso-utn/kommanda/tree/clase-react/10-api-real) · [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/9-comanda-con-bebidas...clase-react/10-api-real)

Ahora queremos pedir los platos a un servidor real, así que necesitamos alguna forma de hacer llamadas HTTP desde el navegador. Hay dos caminos: usar las herramientas que trae el navegador o usar una biblioteca.

El navegador trae dos:

- `XMLHttpRequest`: es la forma vieja. Se llama así porque nació para pedir datos en XML sin recargar la página, aunque después se usó para cualquier formato. Hoy prácticamente no se usa.
- `fetch`: es la forma que traen hoy todos los navegadores. Pueden usarla en sus trabajos prácticos.

También hay bibliotecas que simplifican estas llamadas, como `axios`. Este ejemplo está hecho con `axios`, así que también la pueden usar. Igual, tengan en cuenta que hace poco tuvo un problema de seguridad y que cada vez se usa menos, porque `fetch` ya cubre casi todo lo que hace falta.

En Kommanda:

- Se agrega la dependencia `axios`.
- `cargarPlatos` en `App` pasa a pedir los platos a https://68486e64ec44b9f34940e355.mockapi.io/kommanda/platos en vez de llamar a la función local `getPlatos`.

```js
const cargarPlatos = async () => setPlatos(
  await axios.get('https://68486e64ec44b9f34940e355.mockapi.io/kommanda/platos').then(r => r.data)
)
```

Igual que en el paso 2, `cargarPlatos` es `async` y por eso no se le pasa directamente a `useEffect`: se la define y se la llama adentro del efecto.

---

## Paso 7: Imágenes separadas

Rama: [`clase-react/11-imagenes-separadas`](https://github.com/ddso-utn/kommanda/tree/clase-react/11-imagenes-separadas) · [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/10-api-real...clase-react/11-imagenes-separadas)

**Idea clave: convertir los datos a la forma más fácil de usar.** Antes cada plato traía su imagen adentro. Esa era la "forma feliz": con todo en el mismo lugar, es más fácil trabajar con los datos. Ahora el servidor nos da los datos de una forma más complicada, en dos partes. Lo que hacemos es lo de siempre: convertir esa forma más complicada en una más fácil de manipular, apenas cargamos los datos. Así el resto de la aplicación sigue recibiendo los platos como antes, con su imagen adentro.

- Se hacen dos llamadas: una a `platos-base` y otra a `images`.
- `images` devuelve un array con un único objeto que mapea el `id` de cada plato a la dirección de su imagen.
- Se combinan los dos resultados en el cliente, agregándole a cada plato su imagen:

```js
const platos = await axios.get('.../kommanda/platos-base').then(r => r.data)
const imagenes = await axios.get('.../kommanda/images').then(r => r.data)
setPlatos(platos.map(p => ({...p, imagen: imagenes[0][p.id]})))
```

Las dos llamadas son independientes, así que también se podrían hacer en paralelo con `Promise.all`.

---

## Paso 8: Banner de promociones

Rama: [`clase-react/12-banner`](https://github.com/ddso-utn/kommanda/tree/clase-react/12-banner) · [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/11-imagenes-separadas...clase-react/12-banner)

- Nuevo estado `banner` en `App`.
- `cargarPlatos` hace una tercera llamada a `banner`, que devuelve un array con un objeto que tiene el texto en `message`.
- `Platos` recibe `banner` por props y lo muestra arriba de la lista.

---

## Paso 9: Estado de carga

Rama: [`clase-react/13-estado-de-carga`](https://github.com/ddso-utn/kommanda/tree/clase-react/13-estado-de-carga) · [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/12-banner...clase-react/13-estado-de-carga)

Hasta ahora "está cargando" se deducía de que la lista de platos estuviera vacía. Eso deja de alcanzar: los platos pueden haber llegado y el banner no, o el servidor puede devolver una lista vacía de verdad.

- Nuevo estado `platosLoading`.
- `cargarPlatos` lo pone en `true` al empezar y en `false` cuando terminaron las tres llamadas.
- La ruta `/platos` usa `platosLoading` para decidir si muestra "Cargando..." o la pantalla.

**Idea clave: para mostrar una cosa u otra, una variable de estado.** Lo que se dibuja siempre es función del estado. Entonces, para mostrar alternativamente la pantalla o "Cargando...", se guarda en el estado un booleano que dice si está cargando, y según su valor se muestra una cosa o la otra. Lo único que hay que hacer después es cambiar ese booleano en el momento justo: `true` al empezar a cargar y `false` al terminar.

---

## Paso 10: Manejo de errores

Rama: [`clase-react/14-manejo-de-errores`](https://github.com/ddso-utn/kommanda/tree/clase-react/14-manejo-de-errores) · [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/13-estado-de-carga...clase-react/14-manejo-de-errores)

- Las llamadas de `cargarPlatos` quedan dentro de un `try/catch`.
- Nuevo estado `errorPlatos`, que se completa en el `catch` con el mensaje del error.
- `Platos` recibe `error` por props. Si hay error, muestra el mensaje en vez de la lista.
- Se agrega la clase CSS `.error` para el estilo del mensaje.

Es parecido al estado de carga, con una diferencia: un booleano no alcanza, porque además de saber si hubo un error queremos mostrar cuál fue. Por eso el estado es un string con el mensaje.

**Idea clave: reactividad.** Fíjense que en ningún momento hay una función tipo `mostrarError`. Para mostrar el error, lo único que hacemos es cambiar el estado, y el componente se vuelve a dibujar solo con lo que corresponde. Esa es la idea de reactividad que está detrás de todo React: no le decimos a la pantalla qué hacer, cambiamos el estado y la pantalla lo refleja.

---

## Paso 11: Sacar el estado de los componentes

Rama: [`clase-react/15-context-api`](https://github.com/ddso-utn/kommanda/tree/clase-react/15-context-api) · [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/14-manejo-de-errores...clase-react/15-context-api)

### El problema

Fuimos subiendo un montón de estado a `App`, porque cada vez que dos componentes lo compartían había que llevarlo a un ancestro común. Y terminó todo en el componente que está más arriba de todo. ¿Qué problemas trae eso?

- **`App` tiene demasiadas responsabilidades.** Su trabajo era definir la estructura general de la aplicación. Ahora además maneja platos, bebidas, banner, carga, errores y comanda: cosas que necesitan sus hijos, pero que no tienen por qué ser responsabilidad de `App`.
- **Pasamos todo por props.** Cada dato tiene que bajar por props nivel por nivel hasta el componente que lo usa, y eso se vuelve tedioso. Tiene nombre: *props drilling*. Es un problema menor, pero es un problema.

### Estado global

No es casualidad que ese estado haya terminado en `App`, la raíz del árbol. Está ahí porque lo usan componentes muy distintos, que están en lugares muy separados, como dos páginas diferentes. O sea, es un estado que tiene una idea de globalidad: lo necesita toda la aplicación.

Entonces tiene sentido sacarlo a un lugar aparte, donde se comparta ese estado global. Ese lugar tiene un nombre:

> ***Store***: un almacenamiento separado de los componentes, donde vive el estado global que comparte la aplicación.

Hay varias bibliotecas para implementarlo. Una muy conocida es **Redux**. Otra opción, que se empezó a usar más, es la API de **Context** que trae React: es más moderna y cumple el mismo fin de una forma más simple. Es la que vamos a usar. Además, nos evita el *props drilling*: cada componente toma del contexto lo que necesita, sin que se lo pasen por props.

Lo que hacemos es separar cada pedazo de estado relevante en su propio store, implementado con su propio contexto. La sintaxis es bastante particular; la pueden ver en el código.

**Idea clave: el estado global va a un store aparte, y seguimos respetando el árbol de Flux.** La dependencia sigue siendo jerárquica: los providers están arriba en el árbol, y todos los componentes que usan ese estado se actualizan cada vez que cambia. La diferencia es que ya no cargamos a un componente como `App` con la responsabilidad de manejarlo.

### En Kommanda

- Nuevos providers en `context/`: `PlatosProvider`, `BebidasProvider` y `ComandaProvider`. Cada uno tiene su estado, su carga y lo expone con un contexto.
- Las rutas pasan a `routes.js`, en el componente `AppRoutes`.
- `App.js` queda reducido a anidar los tres providers alrededor de `AppRoutes`.
- `Platos` y `Bebidas` leen del contexto con `useContext` en vez de recibir todo por props.

---

## Paso 12: Separar la API del estado

Rama: [`clase-react/16-separando-api`](https://github.com/ddso-utn/kommanda/tree/clase-react/16-separando-api) · [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/15-context-api...clase-react/16-separando-api)

### El problema

Los providers manejan el estado, pero también saben a qué direcciones pegarle, cuántas llamadas hacer y cómo juntar las respuestas. Son dos responsabilidades distintas, y se nota porque **cambian por razones distintas**: la forma en que agrupamos el estado en stores es una decisión, y cuáles son los endpoints que alimentan esos stores es otra. Si mañana cambian los endpoints, solo debería cambiar la parte que habla con la API.

**Idea clave: separar responsabilidades (SRP).** Cuando dos responsabilidades cambian por razones distintas, el *single responsibility pattern* (SRP) dice que probablemente tienen que estar en componentes separados. Una cosa es el store y otra es la conexión con la API.

### Un componente que habla con la API

**Idea clave: un componente que funciona como *adapter*.** Hacemos un componente que se dedica solo a hablar con la API, parecido al patrón *adapter*:

- **De un lado**, ofrece una interfaz simple para pedir los datos, que usan el store o los componentes que los necesitan. Por ejemplo, `getPlatosFromApi()`.
- **Del otro lado**, hace las llamadas a la API, mapea las respuestas y resuelve toda la complejidad de combinar llamadas a distintos endpoints, como hicimos con las imágenes en el paso 7.

Así, toda esa complejidad queda encapsulada en un solo lugar, y el store recibe los datos ya en la forma feliz.

### En Kommanda

- `mockData/api.js` pasa a `api/api.js`.
- Nuevo `api/platos.js` con `getPlatosFromApi` y `getBanner`, que encapsulan las llamadas con `axios`.
- `PlatosProvider` llama a esas funciones en vez de usar `axios` directamente.
