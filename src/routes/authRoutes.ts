import express from 'express';
import { register, login, getUserById, updateUser, deleteUser  } from '../controllers/authController';
import { authMiddleware, authorizeUserOrAdmin, onlyAdmin } from '../middleware/authMiddleware';
import { crearTareaController } from '../controllers/tareaController';
import { createProject, listProjects, listTasks, createTask, updateTask, editProject, addUserToProject, removeUserFromProject, deleteTask, deleteProject} from '../controllers/proyectoController';
const router = express.Router();

//USUARIOS
router.post('/users', register); // Registrar usuarios
router.post('/auth/login', login); // Login de usuario
router.get('/users/:idUser', authMiddleware, authorizeUserOrAdmin, getUserById); // Buscar un usuario por ID
router.put('/users/:idUser', authMiddleware, authorizeUserOrAdmin,updateUser); //Actualizar usuario
router.delete('/users/:idUser', authMiddleware, onlyAdmin, deleteUser); //Eliminar usuario

// TAREAS
router.put('/projects/:projectId/tasks/:taskId', authMiddleware, updateTask); //Nueva tarea
router.delete('/projects/:projectId/tasks/:taskId', authMiddleware, onlyAdmin, deleteTask); // Eliminar una tarea de un proyecto
router.post('/projects/:projectId/tasks', authMiddleware, createTask); // Crear tareas
router.get('/projects/:projectId/tasks', authMiddleware, listTasks); // Listar tareas que pertenecen a un proyecto

//PROYECTOS
router.post('/projects', authMiddleware, createProject); // Crear proyecto
router.get('/projects', authMiddleware, listProjects); // Listar proyectos del usuairo autenticado
router.put('/projects/:projectId', authMiddleware, editProject);// Editar proyecto
router.post('/projects/:projectId/users',authMiddleware, addUserToProject); // Agregar usuario al proyecto
router.delete('/projects/:projectId/users',authMiddleware,removeUserFromProject); // Eliminar usuario del proyecto
router.delete('/projects/:projectId', authMiddleware, onlyAdmin, deleteProject);// Eliminar un proyecto y todas sus tareas

export default router;
