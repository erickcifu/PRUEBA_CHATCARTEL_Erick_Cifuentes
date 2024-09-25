import { User } from '../entities/User';  // Asegúrate de que el path a la entidad User sea correcto

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number; };
      //user?: User;  // Aquí agregamos la propiedad user de tipo User
    }
  }
}


export {};