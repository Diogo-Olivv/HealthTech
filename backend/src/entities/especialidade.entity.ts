import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Medico } from './medico.entity';

@Entity('especialidades')
export class Especialidade {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 80 })
  nome!: string;

  @Column({ type: 'varchar', length: 80, unique: true })
  slug!: string;

  @Column({ type: 'boolean', default: true })
  ativa!: boolean;

  @ManyToMany(() => Medico, (medico) => medico.especialidades)
  medicos!: Medico[];
}
