# backend/Dockerfile
FROM node:22-alpine

WORKDIR /app

# Solo copiamos package*.json para aprovechar la caché
COPY package*.json ./

# Instala dependencias
RUN npm ci

# Copiamos el resto del código
COPY . .

# Puerto interno de la API
EXPOSE 3000

# Al arrancar el contenedor:
# 1) corre migraciones
# 2) levanta el servidor
CMD ["sh", "-c", "npm run migrate && npm run dev"]
