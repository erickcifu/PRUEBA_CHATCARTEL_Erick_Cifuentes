import Joi from 'joi';

export const crearTareaSchema = Joi.object({
  nombre_tarea: Joi.string().min(5).required(), 
  descripcion_tarea: Joi.string().min(5).optional(),
});

export const updateTaskSchema = Joi.object({
  estado: Joi.string()
    .valid('pendiente', 'en progreso', 'completado')
    .required()
    .messages({
      'any.required': 'El estado es obligatorio.',
      'any.only': 'El estado debe ser uno de los siguientes: pendiente, en progreso, completado.',
    }),
  nombre_tarea: Joi.string().optional(),
  descripcion_tarea: Joi.string().optional(),
});