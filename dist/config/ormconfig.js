"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Rol_1 = require("../entities/Rol");
const Proyecto_1 = require("../entities/Proyecto");
const Tarea_1 = require("../entities/Tarea");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '', // Cambia esta contraseña por la correcta
    database: 'ProyectoDB',
    synchronize: false, // Para desarrollo, en producción debe ser false
    logging: true,
    entities: [User_1.User, Rol_1.Rol, Proyecto_1.Proyecto, Tarea_1.Tarea], // Importa las entidades
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=ormconfig.js.map