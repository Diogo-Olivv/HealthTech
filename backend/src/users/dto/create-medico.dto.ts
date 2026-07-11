import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateMedicoDto extends CreateUserDto {
  @IsString()
  crm!: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Selecione ao menos uma especialidade.' })
  @ArrayMinSize(1)
  @ArrayMaxSize(5, { message: 'É permitido selecionar no máximo 5 especialidades.' })
  @IsUUID('4', { each: true, message: 'Cada especialidade deve ser um UUID válido.' })
  especialidadeIds!: string[];
}
