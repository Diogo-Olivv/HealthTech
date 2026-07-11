import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'maria@exemplo.com', format: 'email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'senhaForte123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
