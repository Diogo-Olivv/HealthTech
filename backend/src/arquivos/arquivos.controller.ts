import { Controller } from '@nestjs/common';
import { ArquivosService } from './arquivos.service';

@Controller('arquivos')
export class ArquivosController {
  constructor(private readonly arquivosService: ArquivosService) {}

  // Os endpoints de upload, listagem e download serão implementados nas próximas issues.
}
