import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from './User';
import { Tarea } from './Tarea';

@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn()
  idProyecto: number;

  @Column()
  nombre_proyecto: string;

  @Column()
  descripcion_proyecto: string;

  @Column({ default: true })
  estado_proyecto: boolean;

  // Relación muchos a muchos con usuarios
  @ManyToMany(() => User, user => user.proyectos)
  @JoinTable()
  usuarios: User[];

  // Relación uno a muchos con tareas
  @OneToMany(() => Tarea, tarea => tarea.proyecto)
  tareas: Tarea[];
}
