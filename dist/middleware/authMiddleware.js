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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyAdmin = exports.authorizeUserOrAdmin = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ormconfig_1 = require("../config/ormconfig");
const User_1 = require("../entities/User");
//const JWT_SECRET = 'your_jwt_secret'; // Asegúrate de mover esto a las variables de entorno en producción
// Verificar el usuario autenticado
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No se ha proporcionado un token, acceso denegado' });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, 'your_jwt_secret');
        req.user = decodedToken;
        console.log("req user: ", req.user);
        console.log("Usuario autenticado:", decodedToken);
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};
exports.authMiddleware = authMiddleware;
// Autorización basada en roles
const authorizeUserOrAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userIdFromParams = parseInt(req.params.idUser); // ID del usuario solicitado
    const loggedInUser = req.user; // Obtenemos al usuario logueado del JWT
    if (!loggedInUser) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    // Verificar qué trae loggedInUser
    console.log("Usuario autenticado desde JWT:", loggedInUser);
    try {
        const userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
        // Obtener al usuario autenticado con sus roles
        const user = yield userRepository.findOne({
            where: { idUser: loggedInUser.userId }, // Comparar correctamente el campo del token con la DB
            relations: ['roles'] // Cargar los roles asociados al usuario
        });
        // Debug: Verificar qué usuario y roles se están obteniendo
        console.log("Usuario con roles desde DB:", user);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Verificar si el usuario tiene el rol 'admin'
        const isAdmin = user.roles.some(rol => rol.nombre_Rol === 'admin');
        console.log("Es admin:", isAdmin);
        // Verificar si el usuario es el dueño de la información o si es administrador
        if (loggedInUser.userId === userIdFromParams || isAdmin) {
            console.log("Permiso concedido");
            next(); // El usuario tiene permiso para continuar
        }
        else {
            return res.status(403).json({ message: 'No tienes permisos para acceder a esta información' });
        }
    }
    catch (error) {
        console.error("Error en la autorización:", error);
        return res.status(500).json({ message: 'Error en la autorización' });
    }
});
exports.authorizeUserOrAdmin = authorizeUserOrAdmin;
//Autorización solo para admin
const onlyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUser = req.user; // El usuario autenticado del JWT
    if (!loggedInUser) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    try {
        const userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
        // Obtener el usuario autenticado con sus roles
        const user = yield userRepository.findOne({
            where: { idUser: loggedInUser.userId },
            relations: ['roles'],
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Verificar si el usuario tiene el rol 'admin'
        const isAdmin = user.roles.some(rol => rol.nombre_Rol === 'admin');
        if (!isAdmin) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar usuarios' });
        }
        next(); // Si es admin, continuar con la siguiente función
    }
    catch (error) {
        console.error("Error en la autorización:", error);
        return res.status(500).json({ message: 'Error en la autorización' });
    }
});
exports.onlyAdmin = onlyAdmin;
//# sourceMappingURL=authMiddleware.js.map