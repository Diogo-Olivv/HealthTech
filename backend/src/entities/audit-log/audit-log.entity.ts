import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TipoEventoAuditoria {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FALHA = 'LOGIN_FALHA',
  CRIACAO_USUARIO = 'CRIACAO_USUARIO',
  ATUALIZACAO_USUARIO = 'ATUALIZACAO_USUARIO',
  EXCLUSAO_USUARIO = 'EXCLUSAO_USUARIO',
  UPLOAD_ARQUIVO = 'UPLOAD_ARQUIVO',
  DOWNLOAD_ARQUIVO = 'DOWNLOAD_ARQUIVO',
  VISUALIZACAO_ARQUIVO = 'VISUALIZACAO_ARQUIVO',
  EXCLUSAO_ARQUIVO = 'EXCLUSAO_ARQUIVO',
  VINCULO_MEDICO_PACIENTE = 'VINCULO_MEDICO_PACIENTE',
  DESVINCULO_MEDICO_PACIENTE = 'DESVINCULO_MEDICO_PACIENTE',
  ACESSO_NEGADO = 'ACESSO_NEGADO',
  TENTATIVA_ESCALONAMENTO_PRIVILEGIO = 'TENTATIVA_ESCALONAMENTO_PRIVILEGIO',
}

export enum StatusAuditoria {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  userId!: string | null;

  @Column({ type: 'enum', enum: TipoEventoAuditoria })
  tipoEvento!: TipoEventoAuditoria;

  @Column({ nullable: true })
  recursoId!: string | null;

  @Column({ type: 'enum', enum: StatusAuditoria })
  status!: StatusAuditoria;

  @Column()
  ipOrigem!: string;

  @Column({ nullable: true })
  userAgent!: string | null;

  @CreateDateColumn()
  timestamp!: Date;
}
