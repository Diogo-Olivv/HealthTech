import {
  Body,
  Controller,
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
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserType } from '../entities/user.entity';
import { ArquivosService } from './arquivos.service';

type AuthRequest = Request & { user: { id: string; tipo: UserType } };

const DEZ_MB = 10 * 1024 * 1024; // 10 MB em bytes

@Controller('arquivos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArquivosController {
  constructor(private readonly arquivosService: ArquivosService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserType.MEDICO)
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
