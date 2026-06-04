import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('medicos')
export class Medico {
  @PrimaryColumn('uuid')
  userId!: string;

  @OneToOne(() => User, (user) => user.medico, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ unique: true })
  crm!: string;

  @Column()
  especialidade!: string;
}
