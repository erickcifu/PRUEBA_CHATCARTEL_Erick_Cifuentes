// src/controllers/projectController.ts
import { Request, Response } from 'express';
import { In } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { Proyecto } from '../entities/Proyecto';
import { Tarea, EstadoTarea } from '../entities/Tarea';
import { User } from '../entities/User';
import { logAction } from '../services/logService';
import { crearTareaSchema } from '../validators/tareaValidator';

// Crear un nuevo proyecto
export const createProject = async (req: Request, res: Response) => {
  const { nombre_proyecto, descripcion_proyecto, userIds } = req.body;
  const loggedInUser = req.user; // El usuario que está autenticado

  try {
    const projectRepo = AppDataSource.getRepository(Proyecto);
    const userRepo = AppDataSource.getRepository(User);

    const users = await userRepo.findBy({
         idUser: In(userIds)
    });

    if (!users.length) {
        return res.status(404).json({ message: 'Usuarios no encontrados' });
      }

    // Crear el proyecto y asignar usuarios
    const newProject = projectRepo.create({
        nombre_proyecto,
        descripcion_proyecto,
        usuarios: users, // Asignar los usuarios encontrados al proyecto
      });

    await projectRepo.save(newProject);
    // Registrar la acción en los logs
    await logAction(loggedInUser.userId,'CREATE', 'PROJECT');

    return res.status(201).json({
        message: 'Proyecto creado correctamente',
        project: newProject // También puedes enviar el proyecto creado
      });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el proyecto', error });
  }
};

// Listar proyectos del usuario autenticado
export const listProjects = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const projectRepo = AppDataSource.getRepository(Proyecto);

  try {
    const projects = await projectRepo.createQueryBuilder('proyecto')
      .leftJoinAndSelect('proyecto.usuarios', 'user')
      .where('user.idUser = :userId', { userId })
      .getMany();

      if (projects.length === 0) {
        return res.status(404).json({ message: 'Sin proyectos asignados' });
      }

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar proyectos', error });
  }
};

// Asignar una tarea a un proyecto para un usuario
export const createTask = async (req: Request, res: Response) => {
    const loggedInUser = req.user; // El usuario que está autenticado
    const { error } = crearTareaSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { nombre_tarea, descripcion_tarea} = req.body;
    const { projectId } = req.params;
    
  
    try {
      const taskRepo = AppDataSource.getRepository(Tarea);
      const projectRepo = AppDataSource.getRepository(Proyecto);
      const userRepo = AppDataSource.getRepository(User);

      const project = await projectRepo.findOne({ where: { idProyecto: parseInt(projectId) } });
      if (!project) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }
  
       // Busca todos los usuarios del proyecto
       const projectUsers = await userRepo.createQueryBuilder('user')
       .innerJoin('user.proyectos', 'project')
       .where('project.idProyecto = :projectId', { projectId: project.idProyecto })
       .getMany();

        if (projectUsers.length === 0) {
            return res.status(404).json({ message: 'No hay usuarios en este proyecto para asignar la tarea.' });
        }

        // Contar las tareas pendientes de cada usuario
        const usersWithPendingTaskCounts = await Promise.all(
          projectUsers.map(async user => {
              const pendingTasksCount = await taskRepo.createQueryBuilder('task')
                  .where('task.asignadoIdUser = :userId', { userId: user.idUser })
                  .andWhere('task.estado = :status', { status: EstadoTarea.PENDIENTE })
                  .getCount();

              return { user, pendingTasksCount };
          })
      );

      // Ordenar los usuarios por la cantidad de tareas pendientes (de menor a mayor)
      usersWithPendingTaskCounts.sort((a, b) => a.pendingTasksCount - b.pendingTasksCount);

      // Asigna al usuario con menos tareas pendientes
      const assignedUser = usersWithPendingTaskCounts[0].user;
      console.log("Asignando tarea al usuario con menos tareas pendientes: ", assignedUser);

  
      const task = taskRepo.create({ 
        nombre_tarea, 
        descripcion_tarea, 
        proyecto: project, 
        asignado: assignedUser, // Asignar el usuario que trabaja en la tarea
        estado: EstadoTarea.PENDIENTE // Usar 'estado' en lugar de 'estadoTarea'
    });

      await taskRepo.save(task);
  
      // Registrar la acción en los logs
    await logAction(loggedInUser.userId,'CREATE', 'TASK');

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la tarea', error });
    }
  };

// Listar tareas de un proyecto
export const listTasks = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const taskRepo = AppDataSource.getRepository(Tarea);

  try {
    const tasks = await taskRepo.find({ where: { proyecto: { idProyecto: parseInt(projectId) } } });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar tareas', error });
  }
};
