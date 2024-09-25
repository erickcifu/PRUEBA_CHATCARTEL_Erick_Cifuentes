import Joi from 'joi';

export const crearTareaSchema = Joi.object({
  nombre_tarea: Joi.string().min(5).required(), 
  descripcion_tarea: Joi.string().min(5).optional(),
});
