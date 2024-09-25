"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRoleByName = exports.roles = void 0;
// Simulamos algunos roles predefinidos
exports.roles = [
    { id_rol: '1', nombre_rol: 'admin', estado_rol: true },
    { id_rol: '2', nombre_rol: 'user', estado_rol: true },
];
// Función para buscar un rol por su nombre
const findRoleByName = (roleName) => {
    return exports.roles.find(role => role.nombre_rol === roleName);
};
exports.findRoleByName = findRoleByName;
//# sourceMappingURL=rolModel.js.map