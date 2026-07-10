import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Audit } from '../audit/audit.decorator';
import { TipoEventoAuditoria } from '../entities/audit-log/audit-log.entity';
import { UserType } from '../entities/user.entity';
import { ArquivosService } from './arquivos.service';
import { ListarArquivosResponseDto } from './dto/listar-arquivos-response.dto';
import type { AuthRequest } from '../auth/models/AuthRequest';

const DEZ_MB = 10 * 1024 * 1024; // 10 MB em bytes

@Controller('arquivos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArquivosController {
  constructor(private readonly arquivosService: ArquivosService) { }

  @Get()
  @Roles(UserType.PACIENTE, UserType.MEDICO)
  @Audit({
    evento: TipoEventoAuditoria.VISUALIZACAO_ARQUIVO,
    extractRecursoId: (_res, req: AuthRequest) => req.user?.id ?? null,
  })
  listar(@Req() req: AuthRequest): Promise<ListarArquivosResponseDto[]> {
    const { id, tipo } = req.user;

    if (tipo === UserType.MEDICO) {
      return this.arquivosService.listarParaMedico(id);
    }

    return this.arquivosService.listarParaPaciente(id);
  }

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserType.MEDICO)
  @Audit({
    evento: TipoEventoAuditoria.UPLOAD_ARQUIVO,
    extractRecursoId: (_res, req: AuthRequest) => req.body?.pacienteId ?? null,
  })
  @UseInterceptors(FileInterceptor('arquivo'))
  async upload(
    @Req() req: AuthRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: DEZ_MB }),
          new FileTypeValidator({
            fileType: /^(application\/pdf|image\/(jpeg|png))$/,
            fallbackToMimetype: true,
          }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
    @Body('pacienteId') pacienteId: string,
  ) {
    const medicoId = req.user.id;
    return this.arquivosService.uploadArquivo(file, pacienteId, medicoId);
  }
}
