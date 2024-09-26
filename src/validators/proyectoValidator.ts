import Joi from 'joi';

// Validación para crear o actualizar un proyecto
export const projectSchema = Joi.object({
    nombre_proyecto: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.base': 'El nombre del proyecto debe ser un texto.',
            'string.empty': 'El nombre del proyecto no puede estar vacío.',
            'string.min': 'El nombre del proyecto debe tener al menos 3 caracteres.',
            'any.required': 'El nombre del proyecto es obligatorio.',
        }),
    
    descripcion_proyecto: Joi.string()
        .min(10)
        .optional()
        .messages({
            'string.base': 'La descripción del proyecto debe ser un texto.',
            'string.min': 'La descripción del proyecto debe tener al menos 10 caracteres.',
        }),
});
