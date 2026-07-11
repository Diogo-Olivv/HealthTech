import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Maria da Silva', description: 'Nome completo do usuário.' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'maria@exemplo.com', format: 'email' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'senhaForte123',
    minLength: 8,
    description: 'Senha em texto puro; será armazenada em hash.',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
