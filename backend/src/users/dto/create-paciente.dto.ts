import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsCpf } from '../../common/validators/is-cpf.validator';

export class CreatePacienteDto extends CreateUserDto {
  @ApiProperty({ example: '12345678909', description: 'CPF do paciente (somente dígitos).' })
  @IsString()
  @IsCpf()
  cpf!: string;

  @ApiProperty({
    example: '1990-05-17',
    type: String,
    format: 'date',
    description: 'Data de nascimento no formato ISO 8601.',
  })
  @IsDate()
  @Type(() => Date)
  dataNascimento!: Date;
}
