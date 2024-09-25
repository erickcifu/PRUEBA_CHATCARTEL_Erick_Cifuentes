import 'reflect-metadata';
import express, { Application } from 'express';
import { AppDataSource } from './config/ormconfig';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import connectMongoDB from '././config/mongoConfig';

const app: Application = express();

// Middleware para parsear los body en JSON
app.use(express.json());
app.use(authRoutes)
// Iniciar la conexión a la base de datos

// const startServer = async () => {
//   try {
//     // Iniciar la conexión a la base de datos MySQL
//     await AppDataSource.initialize();
//     console.log('Conexión a la base de datos MySQL establecida');

//     // Iniciar la conexión a MongoDB
//     await connectMongoDB();
//     console.log('Conexión a MongoDB establecida');

//     // Iniciar el servidor
//     app.listen(3000, () => {
//       console.log('Servidor corriendo en el puerto 3000');
//     });
//   } catch (error) {
//     console.log('Error en la conexión a la base de datos:', error);
//   }
// };

// // Llamar a la función para iniciar el servidor
// startServer();

// export default app;





 AppDataSource.initialize()
   .then(() => {
     console.log('Conexión a la base de datos MySQL establecida');

     connectMongoDB();
     console.log('Conexión a la base de datos Mongo establecida');

     app.listen(3000, () => {
       console.log('Servidor corriendo en el puerto 3000');
     });
   })
   .catch((error) => console.log('Error en la conexión a la base de datos:', error));
  

 export default app;

// // Rutas de autenticación
// app.use('/auth', authRoutes);

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
