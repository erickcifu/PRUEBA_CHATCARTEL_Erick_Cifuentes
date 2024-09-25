import { AppDataSource } from '../config/ormconfig';
import { Tarea } from '../entities/Tarea';
import { User } from '../entities/User';
import { Proyecto } from '../entities/Proyecto';

export const crearTarea = async (projectId: number, taskName: string, taskDescription: string) => {
  const taskRepository = AppDataSource.getRepository(Tarea);
  const userRepository = AppDataSource.getRepository(User);
  const projectRepository = AppDataSource.getRepository(Proyecto);

  // Obtener el proyecto
  const project = await projectRepository.findOne({
    where: { idProyecto: projectId },
    relations: ['usuarios', 'tareas'],
  });

  if (!project) {
    throw new Error('Proyecto no encontrado');
  }

  // Buscar el usuario con menos tareas pendientes en el proyecto
  const AsignarUsuario = await userRepository
    .createQueryBuilder('user')
    .leftJoin('user.tareas', 'tarea')
    .where('tarea.status = :status', { status: 'pendiente' })
    .andWhere('tarea.projectId = :projectId', { projectId })
    .groupBy('user.idUser')
    .orderBy('COUNT(tarea.id)', 'ASC')
    .getOne();

  if (!AsignarUsuario) {
    throw new Error('No hay usuarios disponibles para este proyecto');
  }

  // Crear la nueva tarea
  const newTask = new Tarea();
  newTask.nombre_tarea = taskName;
  newTask.descripcion_tarea = taskDescription;
  newTask.proyecto = project;
  newTask.asignado = AsignarUsuario;

  await taskRepository.save(newTask);

  return newTask;
};
