"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tarea = exports.EstadoTarea = void 0;
const typeorm_1 = require("typeorm");
const Proyecto_1 = require("./Proyecto");
const User_1 = require("./User");
var EstadoTarea;
(function (EstadoTarea) {
    EstadoTarea["PENDIENTE"] = "pendiente";
    EstadoTarea["EN_PROGRESO"] = "en progreso";
    EstadoTarea["COMPLETADO"] = "completado";
})(EstadoTarea || (exports.EstadoTarea = EstadoTarea = {}));
let Tarea = class Tarea {
};
exports.Tarea = Tarea;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Tarea.prototype, "idTarea", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Tarea.prototype, "nombre_tarea", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Tarea.prototype, "descripcion_tarea", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EstadoTarea, default: EstadoTarea.PENDIENTE }),
    __metadata("design:type", String)
], Tarea.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Proyecto_1.Proyecto, (proyecto) => proyecto.tareas),
    __metadata("design:type", Proyecto_1.Proyecto)
], Tarea.prototype, "proyecto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.tareas),
    __metadata("design:type", User_1.User)
], Tarea.prototype, "asignado", void 0);
exports.Tarea = Tarea = __decorate([
    (0, typeorm_1.Entity)()
], Tarea);
//# sourceMappingURL=Tarea.js.map