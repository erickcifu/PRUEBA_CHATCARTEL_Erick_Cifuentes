import mongoose from 'mongoose';

const mongoURI = 'mongodb://127.0.0.1:27017/logs'; // Cambia esto a tu URI de MongoDB

const connectMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error en la conexión a MongoDB:', error);
  }
};

export default connectMongo;
;
