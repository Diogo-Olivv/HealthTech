import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class AtualizarArquivoDto {
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'A descrição deve ter no máximo 200 caracteres.' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  descricao?: string;
}
