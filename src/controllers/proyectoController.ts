// src/controllers/projectController.ts
import { Request, Response } from 'express';
import { In } from 'typeorm';
import { AppDataSource } from '../config/ormconfig';
import { Proyecto } from '../entities/Proyecto';
import { Tarea, EstadoTarea } from '../entities/Tarea';
import { User } from '../entities/User';
import { logAction } from '../services/logService';
import { crearTareaSchema, updateTaskSchema } from '../validators/tareaValidator';
import { projectSchema } from '../validators/proyectoValidator';
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
  
      // Verificar si el usuario pertenece al proyecto de la tarea
    const user = await userRepo.createQueryBuilder('user')
    .innerJoin('user.proyectos', 'project')
    .where('user.idUser = :userId', { userId: loggedInUser.userId })
    .andWhere('project.idProyecto = :projectId', { projectId: project.idProyecto })
    .getOne();

  if (!user) {
    return res.status(403).json({ message: 'No tienes permisos para crear esta tarea' });
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
  const loggedInUser = req.user; // El usuario que está autenticado
  const taskRepo = AppDataSource.getRepository(Tarea);

  try {
    const projectRepo = AppDataSource.getRepository(Proyecto);
      const userRepo = AppDataSource.getRepository(User);

      const project = await projectRepo.findOne({ where: { idProyecto: parseInt(projectId) } });
      if (!project) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }
     // Verificar si el usuario pertenece al proyecto 
     const user = await userRepo.createQueryBuilder('user')
     .innerJoin('user.proyectos', 'project')
     .where('user.idUser = :userId', { userId: loggedInUser.userId })
     .andWhere('project.idProyecto = :projectId', { projectId: project.idProyecto })
     .getOne();
 
   if (!user) {
     return res.status(403).json({ message: 'No tienes permisos para ver las tareas de este proyecto' });
   }

   
    const tasks = await taskRepo.find({ where: { proyecto: { idProyecto: parseInt(projectId) } } });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar tareas', error });
  }
};


//Actualizar el estado de la tarea
export const updateTask = async (req: Request, res: Response) => {
  const loggedInUser = req.user; // Usuario autenticado
  const { taskId } = req.params;
  const { estado } = req.body;

   // Validar el cuerpo de la petición
   const { error } = updateTaskSchema.validate(req.body);
   if (error) {
     return res.status(400).json({ message: error.details[0].message });
   }

  try {
    const taskRepo = AppDataSource.getRepository(Tarea);
    const userRepo = AppDataSource.getRepository(User);
    const task = await taskRepo.findOne({ where: { idTarea: parseInt(taskId) }, relations: ['proyecto'] });

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Verificar si el usuario pertenece al proyecto de la tarea
    const user = await userRepo.createQueryBuilder('user')
      .innerJoin('user.proyectos', 'project')
      .where('user.idUser = :userId', { userId: loggedInUser.userId })
      .andWhere('project.idProyecto = :projectId', { projectId: task.proyecto.idProyecto })
      .getOne();

    if (!user) {
      return res.status(403).json({ message: 'No tienes permisos para actualizar esta tarea' });
    }

    // Actualizar tarea
    if (estado) {
      task.estado = estado;
    }
    

    await taskRepo.save(task);

    // Registrar la acción en los logs
    await logAction(loggedInUser.userId, 'UPDATE', 'TASK');

    res.status(200).json({ message: 'Tarea actualizada', task });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la tarea', error });
  }
};


//Editar proyecto
export const editProject = async (req: Request, res: Response) => {
  const { error } = projectSchema.validate(req.body);

  // Si hay errores de validación, devolver un error 400
  if (error) {
      return res.status(400).json({ message: error.details[0].message });
  }

  const { projectId } = req.params;
  const loggedInUser = req.user; // Usuario autenticado
  const { nombre_proyecto, descripcion_proyecto } = req.body;

  try {
      const projectRepo = AppDataSource.getRepository(Proyecto);
      const userRepo = AppDataSource.getRepository(User);
      // Buscar el proyecto
      const project = await projectRepo.findOne({ where: { idProyecto: parseInt(projectId) } });
      if (!project) {
          return res.status(404).json({ message: 'Proyecto no encontrado' });
      }

    // Verificar si el usuario pertenece al proyecto 
     const user = await userRepo.createQueryBuilder('user')
     .innerJoin('user.proyectos', 'project')
     .where('user.idUser = :userId', { userId: loggedInUser.userId })
     .andWhere('project.idProyecto = :projectId', { projectId: project.idProyecto })
     .getOne();
 
    if (!user) {
     return res.status(403).json({ message: 'No tienes permisos para editar este proyecto' });
    }

      // Actualizar los datos del proyecto
      project.nombre_proyecto = nombre_proyecto || project.nombre_proyecto;
      project.descripcion_proyecto = descripcion_proyecto || project.descripcion_proyecto;

      await projectRepo.save(project);

      // Registrar la acción en los logs
      await logAction(loggedInUser.userId, 'UPDATE', 'PROJECT');

      res.status(200).json({ message: 'Proyecto actualizado correctamente', project });
  } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el proyecto', error });
  }
};


//Agregar usuarios al proyecto
export const addUserToProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { userId } = req.body; 
  const loggedInUser = req.user; // Usuario autenticado
  try {
      const userRepo = AppDataSource.getRepository(User);
      const projectRepo = AppDataSource.getRepository(Proyecto);

      // Verificar si el proyecto existe
      const project = await projectRepo.findOne({ where: { idProyecto: parseInt(projectId) }, relations: ['usuarios'] });
      if (!project) {
          return res.status(404).json({ message: 'Proyecto no encontrado' });
      }

      // Verificar si el usuario pertenece al proyecto 
     const verificarUser = await userRepo.createQueryBuilder('user')
     .innerJoin('user.proyectos', 'project')
     .where('user.idUser = :userId', { userId: loggedInUser.userId })
     .andWhere('project.idProyecto = :projectId', { projectId: project.idProyecto })
     .getOne();
 
      if (!verificarUser) {
      return res.status(403).json({ message: 'No tienes permisos para agregar usuarios a este proyecto' });
      }

      // Verificar si el usuario existe
      const user = await userRepo.findOne({ where: { idUser: parseInt(userId) } });
      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Verificar si el usuario ya está asignado al proyecto
      const isUserAssigned = project.usuarios.some((assignedUser) => assignedUser.idUser === user.idUser);
      if (isUserAssigned) {
          return res.status(400).json({ message: 'El usuario ya está asignado al proyecto, no se puede asignar nuevamente' });
      }

      // Asignar el usuario al proyecto
      project.usuarios.push(user);

      // Registrar la acción en los logs
      await logAction(loggedInUser.userId, 'UPDATE', 'PROJECT');

      await projectRepo.save(project);

      res.status(200).json({ message: 'Usuario agregado con exito al proyecto', project });
  } catch (error) {
      res.status(500).json({ message: 'Error al agregar usuario al proyecto', error });
  }
};


//Eliminar usuario del proyecto
export const removeUserFromProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { userId } = req.body; 
  const loggedInUser = req.user; // Usuario autenticado

  try {
      const userRepo = AppDataSource.getRepository(User);
      const projectRepo = AppDataSource.getRepository(Proyecto);

      // Verificar si el proyecto existe
      const project = await projectRepo.findOne({ where: { idProyecto: parseInt(projectId) }, relations: ['usuarios'] });
      if (!project) {
          return res.status(404).json({ message: 'Proyecto no encontrado' });
      }

      // Verificar si el usuario pertenece al proyecto 
     const verificarUser = await userRepo.createQueryBuilder('user')
     .innerJoin('user.proyectos', 'project')
     .where('user.idUser = :userId', { userId: loggedInUser.userId })
     .andWhere('project.idProyecto = :projectId', { projectId: project.idProyecto })
     .getOne();
 
      if (!verificarUser) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar usuarios de este proyecto' });
      }

      // Verificar si el usuario existe
      const user = await userRepo.findOne({ where: { idUser: parseInt(userId) } });
      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Verificar si el usuario está asignado al proyecto
      const isUserAssigned = project.usuarios.some((assignedUser) => assignedUser.idUser === user.idUser);
      if (!isUserAssigned) {
          return res.status(400).json({ message: 'El usuario no está asignado a este proyecto' });
      }

      // Eliminar al usuario del proyecto
      project.usuarios = project.usuarios.filter((assignedUser) => assignedUser.idUser !== user.idUser);
      
      // Registrar la acción en los logs
      await logAction(loggedInUser.userId, 'UPDATE', 'PROJECT');

      await projectRepo.save(project);

      res.status(200).json({ message: 'Usuario eliminado del proyecto', project });
  } catch (error) {
      res.status(500).json({ message: 'Error al eliminar usuario del proyecto', error });
  }
};


//ELIMINACION

//Eiminar tarea
export const deleteTask = async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;
  const loggedInUser = req.user; // Usuario autenticado

  try {
      const taskRepo = AppDataSource.getRepository(Tarea);
      const projectRepo = AppDataSource.getRepository(Proyecto);

      // Verificar que el proyecto existe
      const project = await projectRepo.findOne({ where: { idProyecto: parseInt(projectId) } });
      if (!project) {
          return res.status(404).json({ message: 'Proyecto no encontrado' });
      }

      // Verificar que la tarea existe y pertenece al proyecto
      const task = await taskRepo.findOne({
          where: { idTarea: parseInt(taskId), proyecto: { idProyecto: parseInt(projectId) } },
      });

      if (!task) {
          return res.status(404).json({ message: 'Tarea no encontrada en el proyecto.' });
      }

      // Eliminar la tarea
      await taskRepo.remove(task);

      // Registrar la acción en los logs
      await logAction(loggedInUser.userId, 'DELETE', 'TASK');

      res.status(200).json({ message: 'Tarea eliminada correctamente.' });
  } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la tarea', error });
  }
};

//Eliminar proyecto
// Eliminar un proyecto con todas sus tareas
export const deleteProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const loggedInUser = req.user; // Usuario autenticado

  try {
      const projectRepo = AppDataSource.getRepository(Proyecto);
      const taskRepo = AppDataSource.getRepository(Tarea);

      // Verificar que el proyecto existe
      const project = await projectRepo.findOne({ where: { idProyecto: parseInt(projectId) } });
      if (!project) {
          return res.status(404).json({ message: 'Proyecto no encontrado' });
      }

      // Eliminar todas las tareas asociadas al proyecto
      await taskRepo.createQueryBuilder()
          .delete()
          .from(Tarea)
          .where('proyectoIdProyecto = :projectId', { projectId: project.idProyecto })
          .execute();

      // Eliminar el proyecto
      await projectRepo.remove(project);

      // Registrar la acción en los logs
      await logAction(loggedInUser.userId, 'DELETE', 'PROJECT');

      res.status(200).json({ message: 'Proyecto y todas sus tareas eliminados correctamente.' });
  } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el proyecto', error });
  }
};
