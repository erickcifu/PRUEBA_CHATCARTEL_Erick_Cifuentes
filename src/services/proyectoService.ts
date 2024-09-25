import { User } from '../entities/User';
import { Tarea } from '../entities/Tarea';
import { AppDataSource } from '../config/ormconfig';

// Obtener usuario con menos tareas pendientes
export const getUserWithFewestPendingTasks = async (projectId: number): Promise<User> => {
  const userRepo = AppDataSource.getRepository(User);

  const usersWithTasks = await userRepo.createQueryBuilder('user')
    .leftJoinAndSelect('user.tareas', 'task')
    .where('task.proyectoIdProyecto = :projectId', { projectId })
    .andWhere('task.estado = :status', { status: 'pendiente' })
    .getMany();

  return usersWithTasks.sort((a, b) => a.tareas.length - b.tareas.length)[0];
};
