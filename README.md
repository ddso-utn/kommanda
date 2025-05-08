Kommanda
========

## Instalación

```bash
npm install
```

## Inicio de la base de datos

```bash
# nota: esto inicia la base de datos utilizando docker
# y de forma efímera: al terminar el contenedor se borrarán los datos
docker run --rm -it --name mongo-kommanda -p 27017:27017 mongo
```

## Inicio del servidor

```bash
npm start
```

## Carga inicial de datos

```bash
./seed.sh
```

## Consulta de la base de datos

```bash
docker exec -it mongo-kommanda  mongosh kommanda
```
