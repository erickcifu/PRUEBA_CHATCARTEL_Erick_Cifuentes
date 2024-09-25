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
exports.createRole = exports.findUserByEmail = void 0;
// src/services/authService.ts
const ormconfig_1 = require("../config/ormconfig");
const Rol_1 = require("../entities/Rol");
const User_1 = require("../entities/User");
const findUserByEmail = (correo) => __awaiter(void 0, void 0, void 0, function* () {
    return ormconfig_1.AppDataSource.getRepository(User_1.User).findOne({
        where: { correo },
        relations: ['roles'],
    });
});
exports.findUserByEmail = findUserByEmail;
const createRole = (nombre_Rol) => __awaiter(void 0, void 0, void 0, function* () {
    const roleRepository = ormconfig_1.AppDataSource.getRepository(Rol_1.Rol);
    const newRole = roleRepository.create({ nombre_Rol });
    return roleRepository.save(newRole);
});
exports.createRole = createRole;
//# sourceMappingURL=authService.js.map