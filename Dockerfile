# 1. Usa una imagen oficial de Node.js como base
FROM node:18-alpine

# 2. Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copia los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# 4. Establece el entorno como producción
ENV NODE_ENV=production

# 5. Instala solo las dependencias de producción
RUN npm install --production

# 6. Copia todos los archivos de tu proyecto al directorio de trabajo dentro del contenedor
COPY . .

# 7. Expone el puerto en el que la aplicación va a escuchar (ejemplo: 3000)
EXPOSE 3000

# 8. Define el comando para correr la aplicación
CMD [ "npm", "start" ]
