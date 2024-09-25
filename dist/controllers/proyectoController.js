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
exports.listTasks = exports.createTask = exports.listProjects = exports.createProject = void 0;
const typeorm_1 = require("typeorm");
const ormconfig_1 = require("../config/ormconfig");
const Proyecto_1 = require("../entities/Proyecto");
const Tarea_1 = require("../entities/Tarea");
const User_1 = require("../entities/User");
const logService_1 = require("../services/logService");
const tareaValidator_1 = require("../validators/tareaValidator");
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
    const taskRepo = ormconfig_1.AppDataSource.getRepository(Tarea_1.Tarea);
    try {
        const tasks = yield taskRepo.find({ where: { proyecto: { idProyecto: parseInt(projectId) } } });
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al listar tareas', error });
    }
});
exports.listTasks = listTasks;
//# sourceMappingURL=proyectoController.js.map