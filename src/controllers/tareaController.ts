import { Request, Response } from 'express';
import { crearTarea } from '../services/tareaService';
import { crearTareaSchema } from '../validators/tareaValidator'; 

export const crearTareaController = async (req: Request, res: Response) => {

  //Validaciones
  const { error } = crearTareaSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { projectId, nombre_tarea, descripcion_tarea } = req.body;

  try {
    const task = await crearTarea(projectId, nombre_tarea, descripcion_tarea);
    res.status(201).json({ message: 'Tarea creada', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
