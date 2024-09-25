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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.login = exports.register = void 0;
const ormconfig_1 = require("../config/ormconfig");
const User_1 = require("../entities/User");
const Rol_1 = require("../entities/Rol");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logService_1 = require("../services/logService");
const userValidator_1 = require("../validators/userValidator"); // Importa el validador
const JWT_SECRET = 'your_jwt_secret';
// Registro de usuario
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, pass, nombre_Rol } = req.body;
    const userData = req.body;
    const { error } = (0, userValidator_1.validateCreate)(userData);
    if (error) {
        return res.status(400).json({
            message: 'Errores de validación',
            errors: error.details.map(err => err.message),
        });
    }
    try {
        // Verificar si el usuario ya existe
        const userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const rolRepository = ormconfig_1.AppDataSource.getRepository(Rol_1.Rol);
        const existeUsuario = yield userRepository.findOneBy({ correo });
        if (existeUsuario) {
            return res.status(400).json({ message: 'El usuario ya está registrado' });
        }
        // Crear nuevo usuario y encriptar la contraseña
        const hashedPassword = yield bcryptjs_1.default.hash(pass, 10);
        const newUser = userRepository.create({ correo, pass: hashedPassword });
        // Buscar el rol por nombre
        const role = yield rolRepository.findOneBy({ nombre_Rol: nombre_Rol });
        if (!role) {
            return res.status(400).json({ message: 'Rol no encontrado' });
        }
        // Asignar el rol al usuario
        newUser.roles = [role];
        yield userRepository.save(newUser);
        return res.status(201).json({ message: 'Usuario registrado', user: newUser });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error });
    }
});
exports.register = register;
// Login de usuario
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, pass } = req.body;
    try {
        const userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({
            where: { correo },
            relations: ['roles'],
        });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        const isValidPassword = yield bcryptjs_1.default.compare(pass, user.pass);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.idUser, roles: user.roles.map((role) => role.nombre_Rol) }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error });
    }
});
exports.login = login;
// Buscar un usuario por ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getUserById llamado con ID:", req.params.id);
    const userId = parseInt(req.params.idUser);
    try {
        const userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({
            where: { idUser: userId },
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Retornar la información del usuario
        console.log("Usuario encontrado por id: ", user);
        return res.status(200).json(user);
    }
    catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        return res.status(500).json({ message: 'Error al obtener la información del usuario' });
    }
});
exports.getUserById = getUserById;
//Actualizar usuario
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.idUser);
    const userData = req.body;
    const loggedInUser = req.user;
    const { error } = (0, userValidator_1.validateUser)(userData);
    if (error) {
        return res.status(400).json({
            message: 'Errores de validación',
            errors: error.details.map(err => err.message),
        });
    }
    try {
        const userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
        // Buscar al usuario por ID
        const user = yield userRepository.findOne({
            where: { idUser: userId },
            relations: ['roles']
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Actualizar los campos deseados
        user.correo = userData.correo || user.correo;
        user.pass = userData.pass || user.pass;
        //Encriptar la contraseña
        if (userData.pass) {
            const salt = yield bcryptjs_1.default.genSalt(10);
            user.pass = yield bcryptjs_1.default.hash(userData.pass, salt); // Encriptar la nueva contraseña
        }
        // Guarda los cambios en la base de datos
        yield userRepository.save(user);
        // Registrar la acción en los logs
        yield (0, logService_1.logAction)(loggedInUser.userId, 'UPDATE', 'USER');
        return res.status(200).json({ message: 'Usuario actualizado', user });
    }
    catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});
exports.updateUser = updateUser;
//ELIMINAR USUARIOS
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.idUser); // 
    const loggedInUser = req.user;
    try {
        const userRepository = ormconfig_1.AppDataSource.getRepository(User_1.User);
        // Buscar al usuario por ID
        const user = yield userRepository.findOne({ where: { idUser: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Eliminar el usuario
        yield userRepository.remove(user);
        // Registrar la acción en los logs
        yield (0, logService_1.logAction)(loggedInUser.userId, 'DELETE', 'USER');
        return res.status(200).json({ message: 'Usuario eliminado con éxito' });
    }
    catch (error) {
        console.error("Error al eliminar el usuario:", error);
        return res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=authController.js.map