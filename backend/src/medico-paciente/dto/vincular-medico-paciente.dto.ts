import { IsUUID } from 'class-validator';

export class VincularMedicoPacienteDto {
  @IsUUID()
  pacienteId!: string;
}
