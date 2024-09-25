import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Rol } from './Rol';
import { Proyecto } from './Proyecto';
import { Tarea } from './Tarea';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column({ unique: true })
  correo: string;

  @Column()
  pass: string;

  @ManyToMany(() => Rol, (rol) => rol.users)
  @JoinTable()
  roles: Rol[];
  
  @ManyToMany(() => Proyecto, (proyecto) => proyecto.usuarios)
  proyectos: Proyecto[];

  @OneToMany(() => Tarea, (tarea) => tarea.asignado)
  tareas: Tarea[];
}
