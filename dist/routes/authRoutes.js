"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const proyectoController_1 = require("../controllers/proyectoController");
const router = express_1.default.Router();
//USUARIOS
router.post('/users', authController_1.register); // Registrar usuarios
router.post('/auth/login', authController_1.login); // Login de usuario
router.get('/users/:idUser', authMiddleware_1.authMiddleware, authMiddleware_1.authorizeUserOrAdmin, authController_1.getUserById); // Buscar un usuario por ID
router.put('/users/:idUser', authMiddleware_1.authMiddleware, authMiddleware_1.authorizeUserOrAdmin, authController_1.updateUser); //Actualizar usuario
router.delete('/users/:idUser', authMiddleware_1.authMiddleware, authMiddleware_1.onlyAdmin, authController_1.deleteUser); //Eliminar usuario
// TAREAS
router.put('/projects/:projectId/tasks/:taskId', authMiddleware_1.authMiddleware, proyectoController_1.updateTask); //Nueva tarea
router.delete('/projects/:projectId/tasks/:taskId', authMiddleware_1.authMiddleware, authMiddleware_1.onlyAdmin, proyectoController_1.deleteTask); // Eliminar una tarea de un proyecto
router.post('/projects/:projectId/tasks', authMiddleware_1.authMiddleware, proyectoController_1.createTask); // Crear tareas
router.get('/projects/:projectId/tasks', authMiddleware_1.authMiddleware, proyectoController_1.listTasks); // Listar tareas que pertenecen a un proyecto
//PROYECTOS
router.post('/projects', authMiddleware_1.authMiddleware, proyectoController_1.createProject); // Crear proyecto
router.get('/projects', authMiddleware_1.authMiddleware, proyectoController_1.listProjects); // Listar proyectos del usuairo autenticado
router.put('/projects/:projectId', authMiddleware_1.authMiddleware, proyectoController_1.editProject); // Editar proyecto
router.post('/projects/:projectId/users', authMiddleware_1.authMiddleware, proyectoController_1.addUserToProject); // Agregar usuario al proyecto
router.delete('/projects/:projectId/users', authMiddleware_1.authMiddleware, proyectoController_1.removeUserFromProject); // Eliminar usuario del proyecto
router.delete('/projects/:projectId', authMiddleware_1.authMiddleware, authMiddleware_1.onlyAdmin, proyectoController_1.deleteProject); // Eliminar un proyecto y todas sus tareas
exports.default = router;
//# sourceMappingURL=authRoutes.js.map