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
// const startServer = async () => {
//   try {
//     // Iniciar la conexión a la base de datos MySQL
//     await AppDataSource.initialize();
//     console.log('Conexión a la base de datos MySQL establecida');
//     // Iniciar la conexión a MongoDB
//     await connectMongoDB();
//     console.log('Conexión a MongoDB establecida');
//     // Iniciar el servidor
//     app.listen(3000, () => {
//       console.log('Servidor corriendo en el puerto 3000');
//     });
//   } catch (error) {
//     console.log('Error en la conexión a la base de datos:', error);
//   }
// };
// // Llamar a la función para iniciar el servidor
// startServer();
// export default app;
ormconfig_1.AppDataSource.initialize()
    .then(() => {
    console.log('Conexión a la base de datos MySQL establecida');
    (0, mongoConfig_1.default)();
    console.log('Conexión a la base de datos Mongo establecida');
    app.listen(3000, () => {
        console.log('Servidor corriendo en el puerto 3000');
    });
})
    .catch((error) => console.log('Error en la conexión a la base de datos:', error));
exports.default = app;
// // Rutas de autenticación
// app.use('/auth', authRoutes);
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
//# sourceMappingURL=app.js.map