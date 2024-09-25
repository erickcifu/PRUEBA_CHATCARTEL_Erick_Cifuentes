"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const tareaController_1 = require("../controllers/tareaController");
const proyectoController_1 = require("../controllers/proyectoController");
const router = express_1.default.Router();
// Ruta para registrar usuario
router.post('/users', authController_1.register);
// Ruta para login de usuario
router.post('/auth/login', authController_1.login);
// Buscar un usuario por ID
router.get('/users/:idUser', authMiddleware_1.authMiddleware, authMiddleware_1.authorizeUserOrAdmin, authController_1.getUserById);
//Actualizar usuario
router.put('/users/:idUser', authMiddleware_1.authMiddleware, authMiddleware_1.authorizeUserOrAdmin, authController_1.updateUser);
//Eliminar usuario
router.delete('/users/:idUser', authMiddleware_1.authMiddleware, authMiddleware_1.onlyAdmin, authController_1.deleteUser);
// TAREAS
//Nueva tarea
router.post('/tasks', authMiddleware_1.authMiddleware, tareaController_1.crearTareaController);
//PROYECTOS
router.post('/projects', authMiddleware_1.authMiddleware, proyectoController_1.createProject);
router.get('/projects', authMiddleware_1.authMiddleware, proyectoController_1.listProjects);
router.post('/projects/:projectId/tasks', authMiddleware_1.authMiddleware, proyectoController_1.createTask);
router.get('/projects/:projectId/tasks', authMiddleware_1.authMiddleware, proyectoController_1.listTasks);
// Ruta protegida
router.get('/protected', authMiddleware_1.authMiddleware, (req, res) => {
    // Si llega aquí, significa que el token fue validado
    const user = req.body.user; // Información del token decodificado
    return res.status(200).json({
        message: 'Estás autenticado y token valido',
        user: user, // Aquí puedes devolver información adicional del usuario si lo deseas
    });
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map