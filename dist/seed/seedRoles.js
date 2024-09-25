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
// src/seed/seedRoles.ts
const ormconfig_1 = require("../config/ormconfig");
const Rol_1 = require("../entities/Rol");
const seedRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    const roleRepository = ormconfig_1.AppDataSource.getRepository(Rol_1.Rol);
    const roles = ['admin', 'user'];
    for (const roleName of roles) {
        const roleExists = yield roleRepository.findOneBy({ nombre_Rol: roleName });
        if (!roleExists) {
            const newRole = roleRepository.create({ nombre_Rol: roleName });
            yield roleRepository.save(newRole);
            console.log(`Rol ${roleName} creado`);
        }
    }
});
ormconfig_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield seedRoles();
    console.log('Seed completado');
    process.exit(0);
}))
    .catch((error) => console.log('Error en la seed:', error));
//# sourceMappingURL=seedRoles.js.map