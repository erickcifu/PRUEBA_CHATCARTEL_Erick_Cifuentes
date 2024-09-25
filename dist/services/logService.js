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
exports.logAction = void 0;
const logs_1 = __importDefault(require("../models/logs")); // Ajusta la ruta según tu estructura
const logAction = (userId, action, resource) => __awaiter(void 0, void 0, void 0, function* () {
    const logEntry = new logs_1.default({
        userId,
        action,
        resource,
    });
    try {
        yield logEntry.save();
        console.log('Log guardado:', logEntry);
    }
    catch (error) {
        console.error('Error al guardar el log:', error);
    }
});
exports.logAction = logAction;
//# sourceMappingURL=logService.js.map