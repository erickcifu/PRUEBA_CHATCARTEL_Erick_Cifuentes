// validators/userValidator.ts
import Joi from 'joi';

const userSchema = Joi.object({
  correo: Joi.string().email().required().messages({
    'string.base': 'El correo debe ser un texto.',
    'string.email': 'El correo no tiene un formato válido.',
    'string.empty': 'El correo no puede estar vacío.',
    'any.required': 'El correo es un campo obligatorio.'
  }),
  pass: Joi.string().min(6).optional().messages({
    'string.base': 'La contraseña debe ser un texto.',
    'string.empty': 'La contraseña no puede estar vacía.',
    'string.min': 'La contraseña debe tener al menos {#limit} caracteres.',
    'any.required': 'La contraseña es un campo obligatorio.'
  }),
  // Agrega otros campos según sea necesario
});

export const validateUser = (userData: any) => {
  return userSchema.validate(userData);
};

//Crear
const createSchema = Joi.object({
  correo: Joi.string().email().required().messages({
    'string.base': 'El correo debe ser un texto.',
    'string.email': 'El correo no tiene un formato válido.',
    'string.empty': 'El correo no puede estar vacío.',
    'any.required': 'El correo es un campo obligatorio.'
  }),
  pass: Joi.string().min(6).required().messages({
    'string.empty': 'La contraseña no puede estar vacía.',
    'string.min': 'La contraseña debe tener al menos {#limit} caracteres.',
    'any.required': 'La contraseña es un campo obligatorio.'
  }),
  nombre_Rol: Joi.string().required().messages({
    'string.base': 'El ROL debe ser un texto.',
    'string.empty': 'El campo ROL no puede estar vacío.',
    'any.required': 'El ROL es un campo obligatorio.'
  }),
  // Agrega otros campos según sea necesario
});

export const validateCreate = (userData: any) => {
  return createSchema.validate(userData);
};