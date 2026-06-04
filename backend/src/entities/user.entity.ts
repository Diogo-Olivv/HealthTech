import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Medico } from './medico.entity';
import { Paciente } from './paciente.entity';

export enum UserType {
  PACIENTE = 'PACIENTE',
  MEDICO = 'MEDICO',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: UserType })
  tipo!: UserType;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => Paciente, (p) => p.user, { cascade: true, nullable: true })
  paciente?: Paciente;

  @OneToOne(() => Medico, (m) => m.user, { cascade: true, nullable: true })
  medico?: Medico;
}
