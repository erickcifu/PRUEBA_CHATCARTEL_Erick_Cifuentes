"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.crearTareaSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.crearTareaSchema = joi_1.default.object({
    nombre_tarea: joi_1.default.string().min(5).required(),
    descripcion_tarea: joi_1.default.string().min(5).optional(),
});
exports.updateTaskSchema = joi_1.default.object({
    estado: joi_1.default.string()
        .valid('pendiente', 'en progreso', 'completado')
        .required()
        .messages({
        'any.required': 'El estado es obligatorio.',
        'any.only': 'El estado debe ser uno de los siguientes: pendiente, en progreso, completado.',
    }),
    nombre_tarea: joi_1.default.string().optional(),
    descripcion_tarea: joi_1.default.string().optional(),
});
//# sourceMappingURL=tareaValidator.js.map