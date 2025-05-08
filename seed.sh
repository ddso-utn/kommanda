#!/bin/bash

# URL del endpoint
URL="http://localhost:3000/platos"

# Función para crear un plato
crear_plato() {
  nombre="$1"
  categoria="$2"
  precio="$3"
  curl -s -XPOST "$URL" \
    -H 'Content-Type: application/json' \
    -d "{\"nombre\":\"$nombre\",\"categoria\":\"$categoria\",\"precio\": $precio}"
}

# Entradas
crear_plato "Empanada de carne" "ENTRADA" 5000
crear_plato "Provoleta" "ENTRADA" 7000
crear_plato "Matambre a la pizza" "ENTRADA" 8000
crear_plato "Picada de quesos" "ENTRADA" 9000
crear_plato "Choripan" "ENTRADA" 6000

# Principales
crear_plato "Milanesa a la napolitana" "PRINCIPAL" 10000
crear_plato "Asado con papas" "PRINCIPAL" 12000
crear_plato "Locro" "PRINCIPAL" 11000
crear_plato "Pollo al disco" "PRINCIPAL" 10500
crear_plato "Ñoquis del 29" "PRINCIPAL" 9500

# Postres
crear_plato "Flan con dulce de leche" "POSTRE" 4000
crear_plato "Panqueque de dulce de leche" "POSTRE" 4500
crear_plato "Bocha de helado" "POSTRE" 5000
crear_plato "Queso y dulce" "POSTRE" 35
crear_plato "Chocotorta" "POSTRE" 55

# Bebidas
crear_plato "Fernet con coca" "BEBIDA" 7000
crear_plato "Copa de vino" "BEBIDA" 9000
crear_plato "Agua mineral" "BEBIDA" 3000
crear_plato "Cerveza de lata" "BEBIDA" 6500
crear_plato "Gaseosa" "BEBIDA" 4000
