import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class CreatePacienteDto extends CreateUserDto {
  @IsString() cpf!: string;
  @IsDate() @Type(() => Date) dataNascimento!: Date;
}