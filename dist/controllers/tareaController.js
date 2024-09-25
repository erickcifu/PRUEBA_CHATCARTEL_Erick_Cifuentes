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
exports.crearTareaController = void 0;
const tareaService_1 = require("../services/tareaService");
const tareaValidator_1 = require("../validators/tareaValidator");
const crearTareaController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Validaciones
    const { error } = tareaValidator_1.crearTareaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { projectId, nombre_tarea, descripcion_tarea } = req.body;
    try {
        const task = yield (0, tareaService_1.crearTarea)(projectId, nombre_tarea, descripcion_tarea);
        res.status(201).json({ message: 'Tarea creada', task });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.crearTareaController = crearTareaController;
//# sourceMappingURL=tareaController.js.map