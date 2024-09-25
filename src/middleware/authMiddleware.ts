import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';

//const JWT_SECRET = 'your_jwt_secret'; // Asegúrate de mover esto a las variables de entorno en producción

// Verificar el usuario autenticado
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No se ha proporcionado un token, acceso denegado' });
  }

  try {
    const decodedToken = jwt.verify(token, 'your_jwt_secret') as any;
    req.user = decodedToken;
    console.log("req user: ", req.user);
    console.log("Usuario autenticado:", decodedToken);
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};


// Autorización basada en roles
export const authorizeUserOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userIdFromParams = parseInt(req.params.idUser); // ID del usuario solicitado
  const loggedInUser = req.user; // Obtenemos al usuario logueado del JWT

  if (!loggedInUser) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }
  // Verificar qué trae loggedInUser
  console.log("Usuario autenticado desde JWT:", loggedInUser);
  try {
    
    const userRepository = AppDataSource.getRepository(User);
    
    // Obtener al usuario autenticado con sus roles
    const user = await userRepository.findOne({
      where: { idUser: loggedInUser.userId }, // Comparar correctamente el campo del token con la DB
      relations: ['roles']  // Cargar los roles asociados al usuario
    });

    // Debug: Verificar qué usuario y roles se están obteniendo
    console.log("Usuario con roles desde DB:", user);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario tiene el rol 'admin'
    const isAdmin = user.roles.some(rol => rol.nombre_Rol === 'admin');
    console.log("Es admin:", isAdmin);
    
    // Verificar si el usuario es el dueño de la información o si es administrador
    if (loggedInUser.userId === userIdFromParams || isAdmin) {
      console.log("Permiso concedido");
      next();  // El usuario tiene permiso para continuar
    } else {
      return res.status(403).json({ message: 'No tienes permisos para acceder a esta información' });
    }
  } catch (error) {
    console.error("Error en la autorización:", error);
    return res.status(500).json({ message: 'Error en la autorización' });
  }
};

//Autorización solo para admin
export const onlyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const loggedInUser = req.user; // El usuario autenticado del JWT

  if (!loggedInUser) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);

    // Obtener el usuario autenticado con sus roles
    const user = await userRepository.findOne({
      where: { idUser: loggedInUser.userId },
      relations: ['roles'],
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario tiene el rol 'admin'
    const isAdmin = user.roles.some(rol => rol.nombre_Rol === 'admin');
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar usuarios' });
    }

    next(); // Si es admin, continuar con la siguiente función
  } catch (error) {
    console.error("Error en la autorización:", error);
    return res.status(500).json({ message: 'Error en la autorización' });
  }
};