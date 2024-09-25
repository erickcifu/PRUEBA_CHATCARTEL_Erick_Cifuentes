import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from './User';

@Entity()
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol: number;

  @Column({ unique: true })
  nombre_Rol: string;

  @Column({ unique: false, default: true  })
  estado_Rol: boolean;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
