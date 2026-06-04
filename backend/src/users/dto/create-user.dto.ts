import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { UserType } from '../../entities/user.entity';

export class CreatePacienteDto {
  @IsString()
  cpf!: string;

  @IsDate()
  @Type(() => Date)
  dataNascimento!: Date;
}

export class CreateMedicoDto {
  @IsString()
  crm!: string;

  @IsString()
  especialidade!: string;
}

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(UserType)
  tipo!: UserType;

  @ValidateIf((o: CreateUserDto) => o.tipo === UserType.PACIENTE)
  @ValidateNested()
  @Type(() => CreatePacienteDto)
  paciente?: CreatePacienteDto;

  @ValidateIf((o: CreateUserDto) => o.tipo === UserType.MEDICO)
  @ValidateNested()
  @Type(() => CreateMedicoDto)
  medico?: CreateMedicoDto;
}
