# Etapa 1: Construcción (Node.js)
FROM node:20-alpine as builder

WORKDIR /app

# Copiamos package.json para instalar dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiamos el resto de los archivos
COPY . .

# Argumentos de construcción para Vite (CapRover inyecta ENVs, pero necesitamos declararlas para el build)
ARG VITE_N8N_DISPONIBILIDAD_URL
ENV VITE_N8N_DISPONIBILIDAD_URL=$VITE_N8N_DISPONIBILIDAD_URL

# Corregimos si hay una subcarpeta anidada app accidental
RUN rm -rf app

RUN npm run build

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuración optimizada
COPY nginx.conf /etc/nginx/conf.d/

# Copiar los archivos construidos desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
