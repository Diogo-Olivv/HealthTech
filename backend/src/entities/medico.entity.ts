import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Especialidade } from './especialidade.entity';

@Entity('medicos')
export class Medico {
  @PrimaryColumn('uuid')
  userId!: string;

  @OneToOne(() => User, (user) => user.medico, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ unique: true })
  crm!: string;

  /**
   * Coluna legada mantida por 1 release para permitir rollback do Deploy 2.
   * Será removida em migration subsequente.
   */
  @Column({ name: 'especialidade_legado', type: 'varchar', nullable: true })
  especialidadeLegado?: string | null;

  @ManyToMany(() => Especialidade, (especialidade) => especialidade.medicos, {
    eager: false,
  })
  @JoinTable({
    name: 'medico_especialidades',
    joinColumn: { name: 'medicoId', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'especialidadeId', referencedColumnName: 'id' },
  })
  especialidades!: Especialidade[];
}
