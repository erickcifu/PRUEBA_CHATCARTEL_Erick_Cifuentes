import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Proyecto } from './Proyecto';
import { User } from './User';

export enum EstadoTarea {
  PENDIENTE = 'pendiente',
  EN_PROGRESO = 'en progreso',
  COMPLETADO = 'completado'
}

@Entity()
export class Tarea {
  @PrimaryGeneratedColumn()
  idTarea: number;

  @Column()
  nombre_tarea: string

  @Column()
  descripcion_tarea: string;

  @Column({ type: 'enum', enum: EstadoTarea, default: EstadoTarea.PENDIENTE })
  estado: EstadoTarea;

  // Relación muchos a uno con la tabla proyectos
  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas)
  proyecto: Proyecto;

  // Relación muchos a muchos con los usuarios (quienes trabajan en la tarea)
  @ManyToOne(() => User, (user) => user.tareas)
  asignado: User;
}
