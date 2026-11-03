# Pistas

Cada paso tiene una lista de pistas, ordenadas de la más general a la más concreta. Cada pista dice para qué confusión sirve y qué decir o cómo guiar al alumno. También se pueden anotar los errores típicos del paso.

Las explicaciones de cada paso no van acá: están en `clases/frontend-2/soluciones.md`. Ahí, cada paso que tiene una conclusión importante la marca como **Idea clave**. Las pistas llevan al alumno a descubrirla; cuando la descubra o termine el paso, reforzásela citando textual lo que dice ese archivo.

Formato de cada pista:

- **Cuándo:** la situación o la duda del alumno.
- **Qué decir:** la pista, o la guía de cómo explicarlo.

---

## Paso 1: Repaso de la selección de platos

## Paso 2: ¿De dónde salen los platos?

## Paso 3: Notas en los platos

Las pistas son un camino que el alumno va recorriendo en orden. Fijate hasta dónde llegó, mirando su código y preguntándole, y dale la pista del primer escalón que todavía no resolvió.

1. **Cuándo:** todavía no hay ningún input en la tarjeta del plato.
   **Qué decir:** que el primer objetivo es que el input se dibuje en la pantalla, dentro de cada tarjeta. Nada más que eso por ahora.

2. **Cuándo:** el input ya se ve, pero no hace nada con lo que se escribe.
   **Qué decir:** que se fije cómo puede capturar lo que va escribiendo el usuario.

3. **Cuándo:** no sabe cómo capturar lo que se escribe.
   **Qué decir:** que lo piense en términos de eventos: ¿qué evento quiere capturar cuando el usuario escribe en el input?

4. **Cuándo:** ya captura el evento, o cree que lo captura.
   **Qué decir:** que pruebe loguear lo que el usuario va escribiendo, de forma que cada vez que toca una tecla se vea el texto en la consola. Así confirma que lo está capturando bien.

5. **Cuándo:** ya ve en el log lo que se escribe.
   **Qué decir:** que piense cómo tendría que hacer para que el componente siempre muestre ese valor.

6. **Cuándo:** no se da cuenta de cómo lograr que el componente muestre siempre ese valor.
   **Qué decir:** guiarlo a que se dé cuenta de que, para que el componente se vuelva a dibujar y muestre el valor, ese valor tiene que ser una variable de estado.

7. **Cuándo:** ya tiene la variable de estado, pero el input no se actualiza.
   **Qué decir:** guiarlo a que se dé cuenta de que, al capturar el evento, tiene que actualizar ese estado.

8. **Cuándo:** el input funciona, pero la nota no llega a la comanda (por ejemplo, porque la guardó en un estado dentro de `CardPlato`).
   **Qué decir:** que piense cómo resolvió lo mismo con el flag `seleccionado` en el paso 1, y que traslade esa analogía: la nota también se tiene que llevar para arriba, a donde se arma la comanda. Es la idea clave del paso 1.

**Al cerrar el paso:** reforzar las ideas clave del paso 3 en `soluciones.md`.

## Paso 4: La comanda en una pantalla aparte

Igual que en el paso anterior, las pistas son un camino en orden. Fijate hasta dónde llegó el alumno y dale la del primer escalón que no resolvió.

1. **Cuándo:** no sabe por dónde empezar, o no existe la ruta `/comanda`.
   **Qué decir:** que lo primero es tener la pantalla nueva. Si no se da cuenta, llevarlo a que tiene que agregar una entrada nueva en el router.

2. **Cuándo:** ya tiene la ruta, pero todavía no muestra nada.
   **Qué decir:** que el objetivo por ahora es solo que la ruta muestre un componente simple que diga "Comanda". Puede probarlo escribiendo `/comanda` en la barra del navegador. Los platos todavía no.

3. **Cuándo:** la pantalla de la comanda se ve si escribe la dirección a mano, pero el botón "Agregar a comanda" no lleva hasta ahí.
   **Qué decir:** que navegar desde el código no es lo mismo que poner un link: el router de React tiene una forma de hacerlo. Si no lo encuentra, decirle que busque `useNavigate` de `react-router`, que devuelve una función para ir a otra ruta.

4. **Cuándo:** ya navega a la pantalla de la comanda y no sabe cómo mostrar los platos ahí.
   **Qué decir:** preguntarle dónde está la lista de platos. Que se dé cuenta de que vive en el estado del componente `Platos`.

5. **Cuándo:** ya sabe que los platos viven en `Platos`, pero no ve cómo llevarlos a `Comanda`.
   **Qué decir:** que piense en el árbol de componentes (el árbol de Flux): ¿dónde están `Platos` y `Comanda`? Que se dé cuenta de que están a la misma altura, y que uno no le puede pasar props al otro.

6. **Cuándo:** entiende que están a la misma altura, pero no sabe qué hacer con eso.
   **Qué decir:** que busque un ancestro común de los dos. El único que hay es `App`. Que deduzca que tiene que subir el estado ahí y bajárselo a los dos hijos por props, igual que en el paso 1.

**Al cerrar el paso:** reforzar la idea clave del paso 4 en `soluciones.md`.

**Error típico:** pasar los platos a través de la navegación, con `navigate('/comanda', { state: ... })` y leyéndolos del otro lado con `useLocation`. Si lo intenta, decirle que no vaya por ahí. No es que esté mal, pero resuelve por él justo lo que este paso quiere que aprenda, que es subir el estado. Además, es una herramienta demasiado genérica para lo que necesita.

## Paso 5: Bebidas en la comanda

## Paso 6: Una API de verdad

## Paso 7: Imágenes separadas

1. **Cuándo:** no sabe por dónde arrancar.
   **Qué decir:** que si los datos de los platos y las imágenes vienen de dos lugares separados, va a tener que pedir las dos cosas y después armarlas juntas.

2. **Cuándo:** hace las dos llamadas, pero algo llega vacío o `undefined`, o arma los platos antes de tener las imágenes.
   **Qué decir:** que las dos llamadas son asíncronas, así que tiene que esperar a que lleguen las dos antes de combinarlas. Si le interesa, mencionarle que también puede esperarlas juntas con `Promise.all`, pero que no hace falta.

3. **Cuándo:** ya tiene las dos respuestas y no sabe cómo juntarlas.
   **Qué decir:** que antes la imagen venía adentro de cada plato, y ahora el servidor la sacó afuera. Esa forma de antes es la "forma feliz": si todo está en el mismo lugar, es más fácil trabajar con los datos. Que piense cómo volver a ella: en el momento de cargar los datos, agregarle a cada plato su imagen, para que el resto de la aplicación los siga recibiendo igual que antes.

**Al cerrar el paso:** reforzar la idea clave del paso 7 en `soluciones.md`.

## Paso 8: Banner de promociones

Es opcional y no trae nada nuevo: sirve para practicar solo lo de los pasos anteriores, y suma datos que hacen más rico el ejercicio en los pasos que siguen. No tiene pistas propias. Si se traba, usá las pistas de los pasos 6 y 7 (pedir datos a un endpoint, esperar la respuesta y guardarla en el estado) y recordale que ya hizo algo muy parecido.

## Paso 9: Estado de carga

Las pistas son un camino en orden. Fijate hasta dónde llegó el alumno y dale la del primer escalón que no resolvió.

1. **Cuándo:** no sabe por dónde arrancar.
   **Qué decir:** que piense cómo haría para mostrar una cosa u otra: o la pantalla con los datos, o un mensaje de "Cargando...".

2. **Cuándo:** no sabe cómo decidir cuál de las dos mostrar.
   **Qué decir:** guiarlo a que se dé cuenta de que lo que se dibuja siempre es función del estado. Entonces, para mostrar dos cosas alternativas, necesita una variable de estado que pueda cambiar y que le diga si está cargando o no. Es un booleano: según su valor, se muestra una cosa o la otra.

3. **Cuándo:** ya tiene el booleano y el renderizado condicional, pero no sabe cuándo cambiarlo, o el mensaje no aparece o no se va.
   **Qué decir:** que tiene que ponerlo en `true` cuando empieza a cargar y en `false` cuando termina. En `cargarPlatos`: antes de empezar la carga lo pone en `true`, en el medio espera todo lo que quiere esperar (platos, imágenes y banner), y cuando terminó de esperar lo pone en `false`.

**Al cerrar el paso:** reforzar la idea clave del paso 9 en `soluciones.md`.

## Paso 10: Manejo de errores

Las pistas son un camino en orden. Fijate hasta dónde llegó el alumno y dale la del primer escalón que no resolvió.

1. **Cuándo:** no sabe por dónde arrancar.
   **Qué decir:** que es parecido al paso anterior: necesita mostrar o no mostrar algo según el caso, esta vez el error.

2. **Cuándo:** ya ve que es parecido, pero no sabe qué guardar en el estado.
   **Qué decir:** que acá no le alcanza con un booleano, porque además de saber si hubo un error quiere mostrar cuál fue. Necesita una variable de estado, pero esta vez un string con el mensaje. Si hay mensaje, se muestra; si no, no.

3. **Cuándo:** ya tiene la variable y la muestra condicionalmente, pero no sabe cómo llenarla.
   **Qué decir:** que la tiene que llenar cuando ocurre un error. Preguntarle: ¿cómo se entera de que hubo un error?

4. **Cuándo:** no sabe cómo enterarse del error.
   **Qué decir:** que puede usar el `.catch` de la promesa, o un `try/catch` alrededor del código con `await`. En el `catch` captura el error y ahí actualiza el estado con el mensaje.

**Al cerrar el paso:** reforzar la idea clave del paso 10 en `soluciones.md`. Hacerle notar que en ningún momento escribió una función tipo `mostrarError`.

## Paso 11: Sacar el estado de los componentes

## Paso 12: Separar la API del estado

Las pistas son un camino en orden. Fijate hasta dónde llegó el alumno y dale la del primer escalón que no resolvió.

1. **Cuándo:** no sabe por dónde arrancar o no ve cuál es el problema.
   **Qué decir:** que mire el `PlatosProvider` y piense cuál es el problema: es un componente con varias responsabilidades. ¿Cuáles son?

2. **Cuándo:** identifica las responsabilidades, pero no ve por qué habría que separarlas.
   **Qué decir:** que piense por qué razones cambiaría cada una. La forma de agrupar el estado en stores es una cosa; cuáles son los endpoints que alimentan esos stores es otra. Si mañana cambian los endpoints, ¿qué parte habría que tocar? Que se dé cuenta de que cambian por razones distintas, y que según el *single responsibility pattern* (SRP) eso indica que tendrían que estar en componentes separados.

3. **Cuándo:** entiende que hay que separar, pero no sabe cómo.
   **Qué decir:** que el store es una cosa y la conexión con la API es otra. Que haga un componente aparte que se dedique solo a hablar con la API, parecido a un *adapter*: de un lado ofrece funciones simples para pedir los datos; del otro, hace las llamadas, mapea las respuestas y combina los endpoints (como las imágenes del paso 7).

4. **Cuándo:** ya armó el componente de la API.
   **Qué decir:** que el provider ahora tiene que usar esas funciones en vez de llamar a `axios` directamente, y que pruebe que la aplicación sigue funcionando igual que antes.

**Al cerrar el paso:** reforzar las ideas clave del paso 12 en `soluciones.md`: SRP y el componente de la API como *adapter*.
