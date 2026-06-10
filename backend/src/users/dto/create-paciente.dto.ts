import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { IsCpf } from '../../common/validators/is-cpf.validator';

export class CreatePacienteDto extends CreateUserDto {
  @IsString() @IsCpf() cpf!: string;
  @IsDate() @Type(() => Date) dataNascimento!: Date;
}