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
exports.crearTarea = void 0;
const ormconfig_1 = require("../config/ormconfig");
const Tarea_1 = require("../entities/Tarea");
const User_1 = require("../entities/User");
const Proyecto_1 = require("../entities/Proyecto");
const crearTarea = (projectId, taskName, taskDescription) => __awaiter(void 0, void 0, void 0, function* () {
    const taskRepository = ormconfig_1.AppDataSource.getRepository(Tarea_1.Tarea);
    const userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
    const projectRepository = ormconfig_1.AppDataSource.getRepository(Proyecto_1.Proyecto);
    // Obtener el proyecto
    const project = yield projectRepository.findOne({
        where: { idProyecto: projectId },
        relations: ['usuarios', 'tareas'],
    });
    if (!project) {
        throw new Error('Proyecto no encontrado');
    }
    // Buscar el usuario con menos tareas pendientes en el proyecto
    const AsignarUsuario = yield userRepository
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
    const newTask = new Tarea_1.Tarea();
    newTask.nombre_tarea = taskName;
    newTask.descripcion_tarea = taskDescription;
    newTask.proyecto = project;
    newTask.asignado = AsignarUsuario;
    yield taskRepository.save(newTask);
    return newTask;
});
exports.crearTarea = crearTarea;
//# sourceMappingURL=tareaService.js.map