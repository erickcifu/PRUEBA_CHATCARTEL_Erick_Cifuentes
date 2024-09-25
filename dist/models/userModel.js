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
exports.validatePassword = exports.createUser = exports.findUserByEmail = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users = []; // Simulando una base de datos
//Buscar usuario por email
const findUserByEmail = (correo) => {
    return users.find(user => user.correo === correo);
};
exports.findUserByEmail = findUserByEmail;
// Creacion de nuevo usuario
const createUser = (correo, pass, estado_user) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(pass, 10);
    //Recibe los datos del nuevo usuario
    const newUser = { id: Date.now().toString(), correo, pass: hashedPassword, estado_user: true };
    users.push(newUser);
    return newUser;
});
exports.createUser = createUser;
const validatePassword = (inputPassword, userPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcryptjs_1.default.compare(inputPassword, userPassword);
});
exports.validatePassword = validatePassword;
//# sourceMappingURL=userModel.js.map