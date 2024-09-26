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
 AppDataSource.initialize()
   .then(() => {
     console.log('Conexión a la base de datos MySQL establecida');

     connectMongoDB();
     console.log('Conexión a la base de datos Mongo establecida');

     const port = process.env.PORT || 3000;
     app.listen(port, () => {
       console.log(`Server running on port ${port}`);
     });
     
   })
   .catch((error) => console.log('Error en la conexión a la base de datos:', error));
  
 export default app;
