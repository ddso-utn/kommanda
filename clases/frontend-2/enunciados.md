# Clase 2 de Frontend: manejo de estado y API

En esta clase seguimos construyendo el frontend de Kommanda. Cada paso arranca desde una rama del repositorio y propone algo para resolver. Algunos pasos los resolvés vos y otros los muestra el docente.

Cuando termines un paso, compará tu solución con la explicación y con la rama resuelta. El siguiente paso siempre arranca desde la rama resuelta del anterior, así que no importa si tu solución quedó distinta.

Para arrancar un paso:

```bash
git checkout clase-react/<rama-de-partida>
cd frontend
npm install
npm start
```

---

## Paso 1: Repaso de la selección de platos

**Lo muestra el docente.** Rama de partida: `clase-react/3-agregando-a-comanda`

En la clase anterior quedó planteado este problema: cada `CardPlato` sabe si está seleccionada, pero `Home` necesita saber cuáles están seleccionadas para mandarlas a la comanda. Hay dos formas de resolverlo, y vemos las dos.

- [Explicación](soluciones.md#paso-1-repaso-de-la-selección-de-platos)
- Solución con un array de seleccionados: [`clase-react/4-levantando-estado-dos-arrays`](https://github.com/ddso-utn/kommanda/tree/clase-react/4-levantando-estado-dos-arrays)
- Solución con un flag `seleccionado` en cada plato: [`clase-react/4-levantando-estado`](https://github.com/ddso-utn/kommanda/tree/clase-react/4-levantando-estado)

---

## Paso 2: ¿De dónde salen los platos?

**Lo muestra el docente.** Rama de partida: `clase-react/4-levantando-estado`

Hasta ahora los platos están escritos a mano en una constante adentro del componente. En una aplicación real vienen de un servidor. ¿Cómo hacemos para pedirlos cuando se muestra la pantalla, si no hay ningún evento del usuario que dispare el pedido?

- [Explicación](soluciones.md#paso-2-de-dónde-salen-los-platos)
- Rama resuelta: [`clase-react/5-cargando-platos`](https://github.com/ddso-utn/kommanda/tree/clase-react/5-cargando-platos)

---

## Paso 3: Notas en los platos

**Para resolver.** Rama de partida: `clase-react/6-agregando-bebidas`

Esta rama ya trae una página de bebidas y la navegación entre `/platos` y `/bebidas`. La vamos a usar más adelante.

Queremos que el cliente pueda dejar una nota en cada plato (por ejemplo "sin cebolla" o "bien cocido"). Cada tarjeta de plato tiene que tener un campo de texto para escribir la nota. Cuando se agregan los platos a la comanda, la nota de cada uno tiene que viajar con el plato.

- [Explicación](soluciones.md#paso-3-notas-en-los-platos)
- Rama resuelta: [`clase-react/7-notas-en-platos`](https://github.com/ddso-utn/kommanda/tree/clase-react/7-notas-en-platos)
- [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/6-agregando-bebidas...clase-react/7-notas-en-platos)

---

## Paso 4: La comanda en una pantalla aparte

**Para resolver.** Rama de partida: `clase-react/7-notas-en-platos`

Hoy, al tocar "Agregar a comanda" aparece un `alert`. Queremos que en lugar de eso la aplicación navegue a una pantalla nueva, `/comanda`, que muestre la lista de platos pedidos.

- [Explicación](soluciones.md#paso-4-la-comanda-en-una-pantalla-aparte)
- Rama resuelta: [`clase-react/8-comanda-con-routing`](https://github.com/ddso-utn/kommanda/tree/clase-react/8-comanda-con-routing)
- [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/7-notas-en-platos...clase-react/8-comanda-con-routing)

---

## Paso 5: Bebidas en la comanda

**Lo muestra el docente.** Rama de partida: `clase-react/8-comanda-con-routing`

La comanda solo tiene platos. Hacemos lo mismo para las bebidas: se eligen platos, después bebidas, y la comanda muestra todo junto.

- [Explicación](soluciones.md#paso-5-bebidas-en-la-comanda)
- Rama resuelta: [`clase-react/9-comanda-con-bebidas`](https://github.com/ddso-utn/kommanda/tree/clase-react/9-comanda-con-bebidas)
- [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/8-comanda-con-routing...clase-react/9-comanda-con-bebidas)

---

## Paso 6: Una API de verdad

**Lo muestra el docente.** Rama de partida: `clase-react/9-comanda-con-bebidas`

Los platos todavía salen de un archivo local que simula ser una API. Los pasamos a pedir a un servidor real usando `axios`.

- [Explicación](soluciones.md#paso-6-una-api-de-verdad)
- Rama resuelta: [`clase-react/10-api-real`](https://github.com/ddso-utn/kommanda/tree/clase-react/10-api-real)
- [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/9-comanda-con-bebidas...clase-react/10-api-real)

---

## Paso 7: Imágenes separadas

**Para resolver.** Rama de partida: `clase-react/10-api-real`

Muchas veces los datos que necesita una pantalla vienen de varias fuentes. Ahora el servidor ya no devuelve los platos con su imagen: los datos de cada plato y las imágenes están en dos endpoints distintos.

- Datos de los platos: https://68486e64ec44b9f34940e355.mockapi.io/kommanda/platos-base
- Imágenes: https://68486e64ec44b9f34940e355.mockapi.io/kommanda/images

La pantalla de platos tiene que seguir mostrando cada plato con su imagen, igual que antes.

- [Explicación](soluciones.md#paso-7-imágenes-separadas)
- Rama resuelta: [`clase-react/11-imagenes-separadas`](https://github.com/ddso-utn/kommanda/tree/clase-react/11-imagenes-separadas)
- [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/10-api-real...clase-react/11-imagenes-separadas)

---

## Paso 8: Banner de promociones

**Para resolver (opcional).** Rama de partida: `clase-react/11-imagenes-separadas`

Queremos mostrar un banner con promociones arriba de la lista de platos. El mensaje del banner viene de este endpoint:

- https://68486e64ec44b9f34940e355.mockapi.io/kommanda/banner

- [Explicación](soluciones.md#paso-8-banner-de-promociones)
- Rama resuelta: [`clase-react/12-banner`](https://github.com/ddso-utn/kommanda/tree/clase-react/12-banner)
- [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/11-imagenes-separadas...clase-react/12-banner)

---

## Paso 9: Estado de carga

**Para resolver.** Rama de partida: `clase-react/12-banner`

La pantalla de platos tiene que mostrarse recién cuando terminaron de cargar los platos, las imágenes y el banner. Mientras tanto, se muestra "Cargando...".

- [Explicación](soluciones.md#paso-9-estado-de-carga)
- Rama resuelta: [`clase-react/13-estado-de-carga`](https://github.com/ddso-utn/kommanda/tree/clase-react/13-estado-de-carga)
- [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/12-banner...clase-react/13-estado-de-carga)

---

## Paso 10: Manejo de errores

**Para resolver.** Rama de partida: `clase-react/13-estado-de-carga`

¿Qué pasa si falla alguna de las llamadas que cargan los platos, las imágenes o el banner? Queremos que la pantalla de platos muestre un mensaje de error simple en vez de la lista.

- [Explicación](soluciones.md#paso-10-manejo-de-errores)
- Rama resuelta: [`clase-react/14-manejo-de-errores`](https://github.com/ddso-utn/kommanda/tree/clase-react/14-manejo-de-errores)
- [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/13-estado-de-carga...clase-react/14-manejo-de-errores)

---

## Paso 11: Sacar el estado de los componentes

**Lo muestra el docente.** Rama de partida: `clase-react/14-manejo-de-errores`

Mirá cómo quedó `App.js`: carga platos, bebidas, banner, maneja la carga, los errores y la comanda, y le pasa todo eso por props a cada pantalla. Cuanto más compartido es un estado, más arriba hay que ponerlo, y más se mezcla con todo lo demás. ¿Cómo separamos el manejo del estado y los datos de lo que es puramente visual?

- [Explicación](soluciones.md#paso-11-sacar-el-estado-de-los-componentes)
- Rama resuelta: [`clase-react/15-context-api`](https://github.com/ddso-utn/kommanda/tree/clase-react/15-context-api)
- [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/14-manejo-de-errores...clase-react/15-context-api)

---

## Paso 12: Separar la API del estado

**Para resolver.** Rama de partida: `clase-react/15-context-api`

Los providers ahora manejan el estado, pero también cargan con toda la responsabilidad de saber cómo hablar con la API: a qué direcciones pegarle, cuántas llamadas hacer y cómo juntar las respuestas. ¿Cómo podrías evitar eso?

Al terminar, la aplicación tiene que funcionar igual que antes.

- [Explicación](soluciones.md#paso-12-separar-la-api-del-estado)
- Rama resuelta: [`clase-react/16-separando-api`](https://github.com/ddso-utn/kommanda/tree/clase-react/16-separando-api)
- [Ver los cambios](https://github.com/ddso-utn/kommanda/compare/clase-react/15-context-api...clase-react/16-separando-api)
