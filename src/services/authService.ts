// src/services/authService.ts
import { AppDataSource } from '../config/ormconfig';
import { Rol } from '../entities/Rol';
import { User } from '../entities/User';

export const findUserByEmail = async (correo: string) => {
  return AppDataSource.getRepository(User).findOne({
    where: { correo },
    relations: ['roles'],
  });
};

export const createRole = async (nombre_Rol: string) => {
  const roleRepository = AppDataSource.getRepository(Rol);
  const newRole = roleRepository.create({ nombre_Rol });
  return roleRepository.save(newRole);
};
