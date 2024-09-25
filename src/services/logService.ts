import LogModel from '../models/logs'; // Ajusta la ruta según tu estructura

export const logAction = async ( userId: number, action: 'CREATE' | 'UPDATE' | 'DELETE', resource: 'USER' | 'PROJECT' | 'TASK') => {
  const logEntry = new LogModel({
    userId,
    action,
    resource,
  });

  try {
    await logEntry.save();
    console.log('Log guardado:', logEntry);
  } catch (error) {
    console.error('Error al guardar el log:', error);
  }
};
