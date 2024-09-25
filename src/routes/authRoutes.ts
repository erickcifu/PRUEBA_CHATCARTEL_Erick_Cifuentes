import express from 'express';
import { register, login, getUserById, updateUser, deleteUser  } from '../controllers/authController';
import { authMiddleware, authorizeUserOrAdmin, onlyAdmin } from '../middleware/authMiddleware';
import { crearTareaController } from '../controllers/tareaController';
import { createProject, listProjects, listTasks, createTask } from '../controllers/proyectoController';
const router = express.Router();

// Ruta para registrar usuario
router.post('/users', register);

// Ruta para login de usuario
router.post('/auth/login', login);

// Buscar un usuario por ID
router.get('/users/:idUser', authMiddleware, authorizeUserOrAdmin, getUserById);

//Actualizar usuario
router.put('/users/:idUser', authMiddleware, authorizeUserOrAdmin,updateUser);

//Eliminar usuario
router.delete('/users/:idUser', authMiddleware, onlyAdmin, deleteUser);

// TAREAS
//Nueva tarea
router.post('/tasks', authMiddleware, crearTareaController);

//PROYECTOS
router.post('/projects', authMiddleware, createProject);
router.get('/projects', authMiddleware, listProjects);
router.post('/projects/:projectId/tasks', authMiddleware, createTask);
router.get('/projects/:projectId/tasks', authMiddleware, listTasks);

// Ruta protegida
router.get('/protected', authMiddleware, (req, res) => {
    // Si llega aquí, significa que el token fue validado
    const user = req.body.user; // Información del token decodificado
  
    return res.status(200).json({
      message: 'Estás autenticado y token valido',
      user: user, // Aquí puedes devolver información adicional del usuario si lo deseas
    });
  });



export default router;
