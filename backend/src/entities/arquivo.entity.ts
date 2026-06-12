import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Paciente } from './paciente.entity';
import { Medico } from './medico.entity';

@Entity('arquivos')
export class Arquivo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nomeOriginal!: string;

  @Column()
  nomeUnico!: string;

  @Column()
  tipo!: string;

  @Column({ type: 'int' })
  tamanho!: number;

  /**
   * @security Campo sensível — guarda o link direto no cloud storage.
   * NUNCA deve ser exposto ao front-end. Use ArquivoResponseDto para
   * serializar respostas e garantir a omissão deste campo.
   */
  @Column()
  caminhoStorage!: string;

  @CreateDateColumn()
  dataUpload!: Date;

  // --- RELACIONAMENTOS ---

  @Column()
  pacienteId!: string;

  /** Paciente ao qual o arquivo pertence. Removido em cascata. */
  @ManyToOne(() => Paciente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pacienteId', referencedColumnName: 'userId' })
  paciente!: Paciente;

  @Column()
  medicoUploadId!: string;

  /** Médico responsável pelo upload do arquivo. Removido em cascata. */
  @ManyToOne(() => Medico, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medicoUploadId', referencedColumnName: 'userId' })
  medicoUpload!: Medico;
}
