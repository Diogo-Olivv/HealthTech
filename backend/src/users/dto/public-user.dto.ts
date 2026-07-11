import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../../entities/user.entity';

export class PublicUserDto {
  @ApiProperty({ format: 'uuid', example: 'd2e4b9a1-5f1c-4c9c-8d2a-2b4f6c8d1e0a' })
  id!: string;

  @ApiProperty({ example: 'maria@exemplo.com', format: 'email' })
  email!: string;

  @ApiProperty({ example: 'Maria da Silva' })
  name!: string;

  @ApiProperty({ enum: UserType, example: UserType.PACIENTE })
  tipo!: UserType;
}

export type PublicUser = PublicUserDto;

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT a ser usado como Bearer nas rotas protegidas.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({ type: PublicUserDto })
  user!: PublicUserDto;
}
