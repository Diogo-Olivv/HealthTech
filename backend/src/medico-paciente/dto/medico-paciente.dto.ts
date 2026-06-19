import { IsUUID } from 'class-validator';

export class MedicoPacienteDto {
  @IsUUID()
  pacienteId!: string;
}
