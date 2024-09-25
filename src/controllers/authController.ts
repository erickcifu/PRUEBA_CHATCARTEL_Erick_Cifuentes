import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';
import { Rol } from '../entities/Rol';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logAction } from '../services/logService';
import { validateUser, validateCreate } from '../validators/userValidator'; // Importa el validador

const JWT_SECRET = 'your_jwt_secret'; 

// Registro de usuario
export const register = async (req: Request, res: Response) => {
  const { correo, pass, nombre_Rol } = req.body;
  const userData = req.body;
  
  const { error } = validateCreate(userData);
  if (error) {
    return res.status(400).json({
      message: 'Errores de validación',
      errors: error.details.map(err => err.message),
    });
  }


  try {
    // Verificar si el usuario ya existe
    const userRepository = AppDataSource.getRepository(User);
    const rolRepository = AppDataSource.getRepository(Rol);
    const existeUsuario = await userRepository.findOneBy({ correo });

    if (existeUsuario) {
      return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    // Crear nuevo usuario y encriptar la contraseña
    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = userRepository.create({ correo, pass: hashedPassword});

    // Buscar el rol por nombre
    const role = await rolRepository.findOneBy({ nombre_Rol: nombre_Rol });
    if (!role) {
      return res.status(400).json({ message: 'Rol no encontrado' });
    }

    // Asignar el rol al usuario
    newUser.roles = [role];
    await userRepository.save(newUser);
    
    return res.status(201).json({ message: 'Usuario registrado', user: newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Login de usuario
export const login = async (req: Request, res: Response) => {
  const { correo, pass } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { correo },
      relations: ['roles'], 
    });

    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isValidPassword = await bcrypt.compare(pass, user.pass);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: user.idUser, roles: user.roles.map((role) => role.nombre_Rol) },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Buscar un usuario por ID
export const getUserById = async (req: Request, res: Response) => {
  console.log("getUserById llamado con ID:", req.params.id);
  const userId = parseInt(req.params.idUser);

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { idUser: userId }, 
    });
    

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Retornar la información del usuario
    console.log("Usuario encontrado por id: ", user);
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error);
    return res.status(500).json({ message: 'Error al obtener la información del usuario' });
  }
};

//Actualizar usuario
export const updateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.idUser); 
  const userData = req.body;
  const loggedInUser = req.user; 

  const { error } = validateUser(userData);
  if (error) {
    return res.status(400).json({
      message: 'Errores de validación',
      errors: error.details.map(err => err.message),
    });
  }

  try {
    const userRepository = AppDataSource.getRepository(User);

    // Buscar al usuario por ID
    const user = await userRepository.findOne({
      where: { idUser: userId },
      relations: ['roles'] 
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar los campos deseados
    user.correo = userData.correo || user.correo;
    user.pass = userData.pass || user.pass; 

    //Encriptar la contraseña
    if (userData.pass) {
      const salt = await bcrypt.genSalt(10);

      user.pass = await bcrypt.hash(userData.pass, salt); // Encriptar la nueva contraseña
    }

    // Guarda los cambios en la base de datos
    await userRepository.save(user);

    // Registrar la acción en los logs
    await logAction(loggedInUser.userId,'UPDATE', 'USER');

    return res.status(200).json({ message: 'Usuario actualizado', user });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    return res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

//ELIMINAR USUARIOS
export const deleteUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.idUser); // 
  const loggedInUser = req.user;
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    // Buscar al usuario por ID
    const user = await userRepository.findOne({ where: { idUser: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Eliminar el usuario
    await userRepository.remove(user);
    // Registrar la acción en los logs
    await logAction(loggedInUser.userId,'DELETE', 'USER');

    return res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
}