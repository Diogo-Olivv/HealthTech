import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class CreateMedicoDto extends CreateUserDto {
  @ApiProperty({ example: 'CRM/SP 123456', description: 'Número do CRM do médico.' })
  @IsString()
  crm!: string;

  @ApiProperty({
    type: [String],
    format: 'uuid',
    minItems: 1,
    maxItems: 5,
    example: ['3f8e1c2d-1234-4a5b-9c8d-1a2b3c4d5e6f'],
    description: 'IDs (UUID v4) das especialidades do médico. Entre 1 e 5.',
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Selecione ao menos uma especialidade.' })
  @ArrayMinSize(1)
  @ArrayMaxSize(5, { message: 'É permitido selecionar no máximo 5 especialidades.' })
  @IsUUID('4', { each: true, message: 'Cada especialidade deve ser um UUID válido.' })
  especialidadeIds!: string[];
}
