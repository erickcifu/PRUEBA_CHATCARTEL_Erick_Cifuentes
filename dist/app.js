"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const ormconfig_1 = require("./config/ormconfig");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const mongoConfig_1 = __importDefault(require("././config/mongoConfig"));
const app = (0, express_1.default)();
// Middleware para parsear los body en JSON
app.use(express_1.default.json());
app.use(authRoutes_1.default);
// Iniciar la conexión a la base de datos
ormconfig_1.AppDataSource.initialize()
    .then(() => {
    console.log('Conexión a la base de datos MySQL establecida');
    (0, mongoConfig_1.default)();
    console.log('Conexión a la base de datos Mongo establecida');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
    .catch((error) => console.log('Error en la conexión a la base de datos:', error));
exports.default = app;
//# sourceMappingURL=app.js.map