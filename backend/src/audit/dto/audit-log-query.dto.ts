import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { TipoEventoAuditoria } from '../../entities/audit-log/audit-log.entity';

@ValidatorConstraint({ name: 'isAfterDataInicio', async: false })
class IsAfterDataInicioConstraint implements ValidatorConstraintInterface {
  validate(dataFim: string, args: ValidationArguments): boolean {
    const { dataInicio } = args.object as AuditLogQueryDto;
    if (!dataInicio || !dataFim) return true;
    return new Date(dataFim).getTime() >= new Date(dataInicio).getTime();
  }

  defaultMessage(): string {
    return 'dataFim deve ser maior ou igual a dataInicio';
  }
}

export class AuditLogQueryDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  usuario?: string;

  @IsOptional()
  @IsEnum(TipoEventoAuditoria)
  tipoEvento?: TipoEventoAuditoria;

  @IsOptional()
  @IsISO8601()
  dataInicio?: string;

  @IsOptional()
  @IsISO8601()
  @Validate(IsAfterDataInicioConstraint)
  dataFim?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
