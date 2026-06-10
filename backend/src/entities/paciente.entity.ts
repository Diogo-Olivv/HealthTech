import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('pacientes')
export class Paciente {
  @PrimaryColumn('uuid')
  userId!: string;

  @OneToOne(() => User, (user) => user.paciente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ unique: true })
  cpf!: string;

  @Column({ type: 'date' })
  dataNascimento!: Date;
}
