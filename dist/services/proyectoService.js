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
exports.getUserWithFewestPendingTasks = void 0;
const User_1 = require("../entities/User");
const ormconfig_1 = require("../config/ormconfig");
// Obtener usuario con menos tareas pendientes
const getUserWithFewestPendingTasks = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepo = ormconfig_1.AppDataSource.getRepository(User_1.User);
    const usersWithTasks = yield userRepo.createQueryBuilder('user')
        .leftJoinAndSelect('user.tareas', 'task')
        .where('task.proyectoIdProyecto = :projectId', { projectId })
        .andWhere('task.estado = :status', { status: 'pendiente' })
        .getMany();
    return usersWithTasks.sort((a, b) => a.tareas.length - b.tareas.length)[0];
});
exports.getUserWithFewestPendingTasks = getUserWithFewestPendingTasks;
//# sourceMappingURL=proyectoService.js.map