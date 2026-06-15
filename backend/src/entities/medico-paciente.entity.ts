import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Medico } from './medico.entity';
import { Paciente } from './paciente.entity';

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

  @CreateDateColumn()
  vinculadoEm!: Date;
}
