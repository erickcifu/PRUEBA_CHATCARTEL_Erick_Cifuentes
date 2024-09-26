# 🚀 API REST en Node.js y TypeScript

[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-v4.7-blue.svg)](https://www.typescriptlang.org/) [![Express](https://img.shields.io/badge/Express-v4.18.1-black.svg)](https://expressjs.com/)

Una API RESTful construida con Node.js, Express y TypeScript. Esta API está diseñada para ser fácilmente escalable y mantiene buenas prácticas de desarrollo.



# API de Gestión de Usuarios

Esta API permite la gestión de usuarios, incluyendo el registro, inicio de sesión y la obtención de información de un usuario específico. Está construida sobre Node.js y utiliza TypeScript y TypeORM.

## Endpoints

### 1. Crear Usuario

- **Endpoint:** `http://localhost:3000/users`
- **Método:** `POST`

#### Request

| Campo       | Tipo   | Descripción                                                                                              |
|-------------|--------|----------------------------------------------------------------------------------------------------------|
| correo      | String | Correo electrónico del usuario. Debe ser único y tener un formato válido.                               |
| pass        | String | Contraseña del usuario. Debe tener un mínimo de 6 caracteres y será encriptada al registrarse.           |
| nombre_Rol  | String | Rol del usuario (llave foránea). Debe ser uno de los siguientes: `user`, `admin`.                       |
----------------------------------------------------------------------------------------------------------------------------------

#### Response

**Código 201 - Created:** Usuario creado exitosamente.
  
  ```json
  {
    "message": "Usuario creado exitosamente."
  }
Código 400 - Bad Request: Errores de validación o si el usuario ya existe.
~~~~
{
  "error": "El usuario ya existe."
}
~~~~
Código 404 - Not Found: Error en el endpoint.
~~~~
{
  "error": "Endpoint no encontrado."
}
~~~~
Código 500 - Error en el servidor: Error interno.
~~~~
{
  "error": "Error en el servidor."
}
~~~~
Endpoint: http://localhost:3000/auth/login
Método: POST
Request

| Campo       | Tipo   | Descripción                                                                                              |
|-------------|--------|----------------------------------------------------------------------------------------------------------|
| correo      | String | Correo electrónico del usuario. Debe ser único y tener un formato válido.                               |
| pass        | String | Contraseña del usuario. Debe tener un mínimo de 6 caracteres y será encriptada al registrarse.           |
----------------------------------------------------------------------------------------------------------------------------------

Response
Código 200 - OK: Inicio de sesión exitoso, devuelve el token JWT.
~~~~
{
  "token": "JWT_TOKEN_AQUI"
}
~~~~
Código 400 - Bad Request: Credenciales inválidas.
~~~~
{
  "error": "Credenciales inválidas."
}
~~~~
Código 404 - Not Found: Error en el endpoint.
~~~~
{
  "error": "Endpoint no encontrado."
}
~~~~
Código 500 - Error en el servidor: Error interno.
~~~~
{
  "error": "Error en el servidor."
}
~~~~
*  Obtener Información de un Usuario
Endpoint: http://localhost:3000/users/id
Método: GET
Response
Código 200 - OK: Usuario encontrado, devuelve la información del usuario.
~~~~
{
  "id": 1,
  "correo": "usuario@ejemplo.com",
  "nombre_Rol": "user"
}
~~~~
Código 403 - Forbidden: Token inválido o expirado.
~~~~
{
  "error": "Token inválido o expirado."
}
~~~~
Código 404 - Not Found: Usuario no encontrado o error en el endpoint.
~~~~
{
  "error": "Usuario no encontrado."
}
~~~~
Código 500 - Error en el servidor: Error interno.
~~~~
{
  "error": "Error en el servidor."
}
~~~~
### Notas
Asegúrate de que la API esté corriendo en http://localhost:3000 antes de realizar las peticiones.
Todos los datos sensibles, como contraseñas, deben manejarse con cuidado y seguir las mejores prácticas de seguridad.








## https://pruebaerick-b12ed88da879.herokuapp.com//auth/login 














