import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://erick:DataBase24@cluster0.dxpyr.mongodb.net/logs?retryWrites=true&w=majority&appName=Cluster0';

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
