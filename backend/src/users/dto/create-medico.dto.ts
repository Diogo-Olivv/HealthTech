import { IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateMedicoDto extends CreateUserDto {
  @IsString() crm!: string;
  @IsString() especialidade!: string;
}
