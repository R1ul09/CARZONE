#!/bin/sh

# Si no existen los certificados, los creamos
if [ ! -f /etc/nginx/certs/carzone.crt ]; then
    echo "Generando certificados SSL auto-firmados..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/certs/carzone.key \
        -out /etc/nginx/certs/carzone.crt \
        -subj "/C=ES/ST=Andalucia/L=Cadiz/O=CarZone/CN=localhost"
fi

# Arrancamos Nginx
nginx -g "daemon off;"