import { Controller, Get } from '@nestjs/common';
import { EspecialidadeResponseDto } from './dto/especialidade-response.dto';
import { EspecialidadesService } from './especialidades.service';

@Controller('especialidades')
export class EspecialidadesController {
  constructor(private readonly service: EspecialidadesService) {}

  @Get()
  listar(): Promise<EspecialidadeResponseDto[]> {
    return this.service.listarAtivas();
  }
}
