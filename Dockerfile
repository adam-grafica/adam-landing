# Etapa 1: Construcción (Node.js)
FROM node:20-alpine as builder

WORKDIR /app

# Copiamos package.json de la capeta app/ para instalar dependencias de la versión más reciente
COPY app/package*.json ./
RUN npm install --legacy-peer-deps

# Copiamos el resto de la carpeta app/
COPY app/ .

# Corregimos si hay una subcarpeta anidada app accidental (para que Vite no genere dist/app/index.html)
RUN rm -rf app

RUN npm run build

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuración optimizada
COPY app/nginx.conf /etc/nginx/conf.d/

# Copiar los archivos construidos desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
