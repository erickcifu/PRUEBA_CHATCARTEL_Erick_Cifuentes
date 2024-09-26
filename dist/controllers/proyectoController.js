"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.deleteTask = exports.removeUserFromProject = exports.addUserToProject = exports.editProject = exports.updateTask = exports.listTasks = exports.createTask = exports.listProjects = exports.createProject = void 0;
const typeorm_1 = require("typeorm");
const ormconfig_1 = require("../config/ormconfig");
const Proyecto_1 = require("../entities/Proyecto");
const Tarea_1 = require("../entities/Tarea");
const User_1 = require("../entities/User");
const logService_1 = require("../services/logService");
const tareaValidator_1 = require("../validators/tareaValidator");
const proyectoValidator_1 = require("../validators/proyectoValidator");
// Crear un nuevo proyecto
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_proyecto, descripcion_proyecto, userIds } = req.body;
    const loggedInUser = req.user; // El usuario que está autenticado
    try {
        const projectRepo = ormconfig_1.AppDataSource.getRepository(Proyecto_1.Proyecto);
        const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const users = yield userRepo.findBy({
            idUser: (0, typeorm_1.In)(userIds)
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
        yield projectRepo.save(newProject);
        // Registrar la acción en los logs
        yield (0, logService_1.logAction)(loggedInUser.userId, 'CREATE', 'PROJECT');
        return res.status(201).json({
            message: 'Proyecto creado correctamente',
            project: newProject // También puedes enviar el proyecto creado
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear el proyecto', error });
    }
});
exports.createProject = createProject;
// Listar proyectos del usuario autenticado
const listProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const projectRepo = ormconfig_1.AppDataSource.getRepository(Proyecto_1.Proyecto);
    try {
        const projects = yield projectRepo.createQueryBuilder('proyecto')
            .leftJoinAndSelect('proyecto.usuarios', 'user')
            .where('user.idUser = :userId', { userId })
            .getMany();
        if (projects.length === 0) {
            return res.status(404).json({ message: 'Sin proyectos asignados' });
        }
        return res.status(200).json(projects);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al listar proyectos', error });
    }
});
exports.listProjects = listProjects;
// Asignar una tarea a un proyecto para un usuario
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUser = req.user; // El usuario que está autenticado
    const { error } = tareaValidator_1.crearTareaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { nombre_tarea, descripcion_tarea } = req.body;
    const { projectId } = req.params;
    try {
        const taskRepo = ormconfig_1.AppDataSource.getRepository(Tarea_1.Tarea);
        const projectRepo = ormconfig_1.AppDataSource.getRepository(Proyecto_1.Proyecto);
        const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const project = yield projectRepo.findOne({ where: { idProyecto: parseInt(projectId) } });
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        // Verificar si el usuario pertenece al proyecto de la tarea
        const user = yield userRepo.createQueryBuilder('user')
            .innerJoin('user.proyectos', 'project')
            .where('user.idUser = :userId', { userId: loggedInUser.userId })
            .andWhere('project.idProyecto = :projectId', { projectId: project.idProyecto })
            .getOne();
        if (!user) {
            return res.status(403).json({ message: 'No tienes permisos para crear esta tarea' });
        }
        // Busca todos los usuarios del proyecto
        const projectUsers = yield userRepo.createQueryBuilder('user')
            .innerJoin('user.proyectos', 'project')
            .where('project.idProyecto = :projectId', { projectId: project.idProyecto })
            .getMany();
        if (projectUsers.length === 0) {
            return res.status(404).json({ message: 'No hay usuarios en este proyecto para asignar la tarea.' });
        }
        // Contar las tareas pendientes de cada usuario
        const usersWithPendingTaskCounts = yield Promise.all(projectUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const pendingTasksCount = yield taskRepo.createQueryBuilder('task')
                .where('task.asignadoIdUser = :userId', { userId: user.idUser })
                .andWhere('task.estado = :status', { status: Tarea_1.EstadoTarea.PENDIENTE })
                .getCount();
            return { user, pendingTasksCount };
        })));
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
            estado: Tarea_1.EstadoTarea.PENDIENTE // Usar 'estado' en lugar de 'estadoTarea'
        });
        yield taskRepo.save(task);
        // Registrar la acción en los logs
        yield (0, logService_1.logAction)(loggedInUser.userId, 'CREATE', 'TASK');
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea', error });
    }
});
exports.createTask = createTask;
// Listar tareas de un proyecto
const listTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const loggedInUser = req.user; // El usuario que está autenticado
    const taskRepo = ormconfig_1.AppDataSource.getRepository(Tarea_1.Tarea);
    try {
        const projectRepo = ormconfig_1.AppDataSource.getRepository(Proyecto_1.Proyecto);
        const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const project = yield projectRepo.findOne({ where: { idProyecto: parseInt(projectId) } });
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        // Verificar si el usuario pertenece al proyecto 
        const user = yield userRepo.createQueryBuilder('user')
            .innerJoin('user.proyectos', 'project')
            .where('user.idUser = :userId', { userId: loggedInUser.userId })
            .andWhere('project.idProyecto = :projectId', { projectId: project.idProyecto })
            .getOne();
        if (!user) {
            return res.status(403).json({ message: 'No tienes permisos para ver las tareas de este proyecto' });
        }
        const tasks = yield taskRepo.find({ where: { proyecto: { idProyecto: parseInt(projectId) } } });
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al listar tareas', error });
    }
});
exports.listTasks = listTasks;
//Actualizar el estado de la tarea
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUser = req.user; // Usuario autenticado
    const { taskId } = req.params;
    const { estado } = req.body;
    // Validar el cuerpo de la petición
    const { error } = tareaValidator_1.updateTaskSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const taskRepo = ormconfig_1.AppDataSource.getRepository(Tarea_1.Tarea);
        const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const task = yield taskRepo.findOne({ where: { idTarea: parseInt(taskId) }, relations: ['proyecto'] });
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        // Verificar si el usuario pertenece al proyecto de la tarea
        const user = yield userRepo.createQueryBuilder('user')
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
        yield taskRepo.save(task);
        // Registrar la acción en los logs
        yield (0, logService_1.logAction)(loggedInUser.userId, 'UPDATE', 'TASK');
        res.status(200).json({ message: 'Tarea actualizada', task });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea', error });
    }
});
exports.updateTask = updateTask;
//Editar proyecto
const editProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = proyectoValidator_1.projectSchema.validate(req.body);
    // Si hay errores de validación, devolver un error 400
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { projectId } = req.params;
    const loggedInUser = req.user; // Usuario autenticado
    const { nombre_proyecto, descripcion_proyecto } = req.body;
    try {
        const projectRepo = ormconfig_1.AppDataSource.getRepository(Proyecto_1.Proyecto);
        const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
        // Buscar el proyecto
        const project = yield projectRepo.findOne({ where: { idProyecto: parseInt(projectId) } });
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        // Verificar si el usuario pertenece al proyecto 
        const user = yield userRepo.createQueryBuilder('user')
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
        yield projectRepo.save(project);
        // Registrar la acción en los logs
        yield (0, logService_1.logAction)(loggedInUser.userId, 'UPDATE', 'PROJECT');
        res.status(200).json({ message: 'Proyecto actualizado correctamente', project });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el proyecto', error });
    }
});
exports.editProject = editProject;
//Agregar usuarios al proyecto
const addUserToProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const { userId } = req.body;
    const loggedInUser = req.user; // Usuario autenticado
    try {
        const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const projectRepo = ormconfig_1.AppDataSource.getRepository(Proyecto_1.Proyecto);
        // Verificar si el proyecto existe
        const project = yield projectRepo.findOne({ where: { idProyecto: parseInt(projectId) }, relations: ['usuarios'] });
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        // Verificar si el usuario pertenece al proyecto 
        const verificarUser = yield userRepo.createQueryBuilder('user')
            .innerJoin('user.proyectos', 'project')
            .where('user.idUser = :userId', { userId: loggedInUser.userId })
            .andWhere('project.idProyecto = :projectId', { projectId: project.idProyecto })
            .getOne();
        if (!verificarUser) {
            return res.status(403).json({ message: 'No tienes permisos para agregar usuarios a este proyecto' });
        }
        // Verificar si el usuario existe
        const user = yield userRepo.findOne({ where: { idUser: parseInt(userId) } });
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
        yield (0, logService_1.logAction)(loggedInUser.userId, 'UPDATE', 'PROJECT');
        yield projectRepo.save(project);
        res.status(200).json({ message: 'Usuario agregado con exito al proyecto', project });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al agregar usuario al proyecto', error });
    }
});
exports.addUserToProject = addUserToProject;
//Eliminar usuario del proyecto
const removeUserFromProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const { userId } = req.body;
    const loggedInUser = req.user; // Usuario autenticado
    try {
        const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const projectRepo = ormconfig_1.AppDataSource.getRepository(Proyecto_1.Proyecto);
        // Verificar si el proyecto existe
        const project = yield projectRepo.findOne({ where: { idProyecto: parseInt(projectId) }, relations: ['usuarios'] });
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        // Verificar si el usuario pertenece al proyecto 
        const verificarUser = yield userRepo.createQueryBuilder('user')
            .innerJoin('user.proyectos', 'project')
            .where('user.idUser = :userId', { userId: loggedInUser.userId })
            .andWhere('project.idProyecto = :projectId', { projectId: project.idProyecto })
            .getOne();
        if (!verificarUser) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar usuarios de este proyecto' });
        }
        // Verificar si el usuario existe
        const user = yield userRepo.findOne({ where: { idUser: parseInt(userId) } });
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
        yield (0, logService_1.logAction)(loggedInUser.userId, 'UPDATE', 'PROJECT');
        yield projectRepo.save(project);
        res.status(200).json({ message: 'Usuario eliminado del proyecto', project });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario del proyecto', error });
    }
});
exports.removeUserFromProject = removeUserFromProject;
//ELIMINACION
//Eiminar tarea
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId, taskId } = req.params;
    const loggedInUser = req.user; // Usuario autenticado
    try {
        const taskRepo = ormconfig_1.AppDataSource.getRepository(Tarea_1.Tarea);
        const projectRepo = ormconfig_1.AppDataSource.getRepository(Proyecto_1.Proyecto);
        // Verificar que el proyecto existe
        const project = yield projectRepo.findOne({ where: { idProyecto: parseInt(projectId) } });
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        // Verificar que la tarea existe y pertenece al proyecto
        const task = yield taskRepo.findOne({
            where: { idTarea: parseInt(taskId), proyecto: { idProyecto: parseInt(projectId) } },
        });
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada en el proyecto.' });
        }
        // Eliminar la tarea
        yield taskRepo.remove(task);
        // Registrar la acción en los logs
        yield (0, logService_1.logAction)(loggedInUser.userId, 'DELETE', 'TASK');
        res.status(200).json({ message: 'Tarea eliminada correctamente.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea', error });
    }
});
exports.deleteTask = deleteTask;
//Eliminar proyecto
// Eliminar un proyecto con todas sus tareas
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const loggedInUser = req.user; // Usuario autenticado
    try {
        const projectRepo = ormconfig_1.AppDataSource.getRepository(Proyecto_1.Proyecto);
        const taskRepo = ormconfig_1.AppDataSource.getRepository(Tarea_1.Tarea);
        // Verificar que el proyecto existe
        const project = yield projectRepo.findOne({ where: { idProyecto: parseInt(projectId) } });
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        // Eliminar todas las tareas asociadas al proyecto
        yield taskRepo.createQueryBuilder()
            .delete()
            .from(Tarea_1.Tarea)
            .where('proyectoIdProyecto = :projectId', { projectId: project.idProyecto })
            .execute();
        // Eliminar el proyecto
        yield projectRepo.remove(project);
        // Registrar la acción en los logs
        yield (0, logService_1.logAction)(loggedInUser.userId, 'DELETE', 'PROJECT');
        res.status(200).json({ message: 'Proyecto y todas sus tareas eliminados correctamente.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar el proyecto', error });
    }
});
exports.deleteProject = deleteProject;
//# sourceMappingURL=proyectoController.js.map