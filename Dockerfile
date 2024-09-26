# 1. Usa una imagen oficial de Node.js como base
FROM node:18-alpine

# 2. Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copia los archivos package.json y package-lock.json a la imagen del contenedor
COPY package.json package-lock.json 

ENV NODE_ENV=production


# 4. Instala las dependencias necesarias
RUN npm install --production

# Si estás en un entorno de desarrollo, puedes usar:
# RUN npm install

# 5. Copia todos los archivos de tu proyecto al directorio de trabajo dentro del contenedor
COPY . .

# 6. Expone el puerto en el que la aplicación va a escuchar (ejemplo: 3000)
EXPOSE 3000

# 7. Define el comando para correr la aplicación
CMD [ "npm", "start" ]
