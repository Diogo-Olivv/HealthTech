import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Medico } from './medico.entity';
import { Paciente } from './paciente.entity';

export enum StatusVinculo {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  REJEITADO = 'REJEITADO',
  REVOGADO = 'REVOGADO',
}

@Entity('medico_paciente')
export class MedicoPaciente {
  @PrimaryColumn('uuid')
  medicoId!: string;

  @PrimaryColumn('uuid')
  pacienteId!: string;

  @ManyToOne(() => Medico, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medicoId', referencedColumnName: 'userId' })
  medico!: Medico;

  @ManyToOne(() => Paciente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pacienteId', referencedColumnName: 'userId' })
  paciente!: Paciente;

  @Index()
  @Column({
    type: 'enum',
    enum: StatusVinculo,
    default: StatusVinculo.PENDENTE,
  })
  status!: StatusVinculo;

  @Column({ type: 'uuid' })
  solicitadoPor!: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  solicitadoEm!: Date;

  @Column({ type: 'timestamp', nullable: true })
  respondidoEm!: Date | null;

  /** Versão do termo de consentimento aceito no momento da aprovação (LGPD Art. 8º). */
  @Column({ type: 'varchar', nullable: true })
  termoVersao!: string | null;

  @CreateDateColumn()
  vinculadoEm!: Date;
}
