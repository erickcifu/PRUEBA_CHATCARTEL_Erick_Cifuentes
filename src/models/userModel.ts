import bcrypt from 'bcryptjs';
import { Rol, findRoleByName } from './rolModel';

export interface User {
  id: string;
  correo: string;
  pass: string;
  estado_user: boolean;
  //rol: Rol;
}

const users: User[] = []; // Simulando una base de datos

//Buscar usuario por email
export const findUserByEmail = (correo: string): User | undefined => {
  return users.find(user => user.correo === correo);
};

// Creacion de nuevo usuario
export const createUser = async (correo: string, pass: string, estado_user: boolean): Promise<User> => {
  const hashedPassword = await bcrypt.hash(pass, 10);

  //Recibe los datos del nuevo usuario
  const newUser: User = { id: Date.now().toString(), correo, pass: hashedPassword, estado_user: true };
  users.push(newUser);
  return newUser;
};

export const validatePassword = async (inputPassword: string, userPassword: string): Promise<boolean> => {
  return bcrypt.compare(inputPassword, userPassword);
};
