"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreate = exports.validateUser = void 0;
// validators/userValidator.ts
const joi_1 = __importDefault(require("joi"));
const userSchema = joi_1.default.object({
    correo: joi_1.default.string().email().required().messages({
        'string.base': 'El correo debe ser un texto.',
        'string.email': 'El correo no tiene un formato válido.',
        'string.empty': 'El correo no puede estar vacío.',
        'any.required': 'El correo es un campo obligatorio.'
    }),
    pass: joi_1.default.string().min(6).optional().messages({
        'string.base': 'La contraseña debe ser un texto.',
        'string.empty': 'La contraseña no puede estar vacía.',
        'string.min': 'La contraseña debe tener al menos {#limit} caracteres.',
        'any.required': 'La contraseña es un campo obligatorio.'
    }),
    // Agrega otros campos según sea necesario
});
const validateUser = (userData) => {
    return userSchema.validate(userData);
};
exports.validateUser = validateUser;
//Crear
const createSchema = joi_1.default.object({
    correo: joi_1.default.string().email().required().messages({
        'string.base': 'El correo debe ser un texto.',
        'string.email': 'El correo no tiene un formato válido.',
        'string.empty': 'El correo no puede estar vacío.',
        'any.required': 'El correo es un campo obligatorio.'
    }),
    pass: joi_1.default.string().min(6).required().messages({
        'string.empty': 'La contraseña no puede estar vacía.',
        'string.min': 'La contraseña debe tener al menos {#limit} caracteres.',
        'any.required': 'La contraseña es un campo obligatorio.'
    }),
    nombre_Rol: joi_1.default.string().required().messages({
        'string.base': 'El ROL debe ser un texto.',
        'string.empty': 'El campo ROL no puede estar vacío.',
        'any.required': 'El ROL es un campo obligatorio.'
    }),
    // Agrega otros campos según sea necesario
});
const validateCreate = (userData) => {
    return createSchema.validate(userData);
};
exports.validateCreate = validateCreate;
//# sourceMappingURL=userValidator.js.map