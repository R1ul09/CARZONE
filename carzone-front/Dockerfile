# ETAPA 1: Construcción (Node.js)
FROM node:22-alpine AS build
WORKDIR /app

# Copiamos solo los archivos de dependencias primero para aprovechar el caché de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build

# ETAPA 2: Servidor de producción (Nginx)
FROM nginx:alpine

# Limpiamos el directorio por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos el resultado de la etapa de construcción a Nginx
COPY --from=build /app/dist/carzone-front/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]