# Dockerfile

# 1. Usa una imagen oficial de Node.js como base
FROM node:16-alpine

# 2. Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copia el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# 4. Instala las dependencias de la aplicación
RUN npm install --only=production

# 5. Copia todo el contenido del proyecto al contenedor
COPY . .

# 6. Expone el puerto en el que la aplicación correrá (Heroku usará el puerto asignado por ellos)
EXPOSE 3000

# 7. Define el comando que se ejecutará cuando se inicie el contenedor
CMD [ "npm", "start" ]
