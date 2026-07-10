import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  ParseUUIDPipe,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserType } from '../entities/user.entity';
import { ArquivosService } from './arquivos.service';
import { AtualizarArquivoDto } from './dto/atualizar-arquivo.dto';
import { ArquivoResponseDto } from './dto/arquivo-response.dto';
import { DownloadArquivoResponseDto } from './dto/download-arquivo-response.dto';
import { ListarArquivosResponseDto } from './dto/listar-arquivos-response.dto';

type AuthRequest = Request & {
  user: { id: string; tipo: UserType };
};

const DEZ_MB = 10 * 1024 * 1024;

@Controller('arquivos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArquivosController {
  constructor(private readonly arquivosService: ArquivosService) {}

  @Get()
  @Roles(UserType.PACIENTE, UserType.MEDICO)
  listar(@Req() req: AuthRequest): Promise<ListarArquivosResponseDto[]> {
    const { id, tipo } = req.user;

    if (tipo === UserType.MEDICO) {
      return this.arquivosService.listarParaMedico(id);
    }

    return this.arquivosService.listarParaPaciente(id);
  }

  @Get('paciente/:pacienteId')
  @Roles(UserType.MEDICO)
  listarProntuario(
    @Req() req: AuthRequest,
    @Param('pacienteId', ParseUUIDPipe) pacienteId: string,
  ): Promise<ListarArquivosResponseDto[]> {
    const medicoId = req.user.id;
    return this.arquivosService.listarProntuarioPaciente(medicoId, pacienteId);
  }

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
    @Body('pacienteId', new ParseUUIDPipe()) pacienteId: string,
    @Body('descricao') descricao?: string,
  ): Promise<ArquivoResponseDto> {
    const medicoId = req.user.id;
    return this.arquivosService.uploadArquivo(
      file,
      pacienteId,
      medicoId,
      descricao,
    );
  }

  @Get(':id/download')
  @Roles(UserType.PACIENTE, UserType.MEDICO)
  gerarUrlDownload(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DownloadArquivoResponseDto> {
    return this.arquivosService.gerarUrlDownload(id, req.user.id, req.user.tipo);
  }

  @Get(':id/raw')
  @Roles(UserType.PACIENTE, UserType.MEDICO)
  async streamArquivo(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const { buffer, nomeOriginal, mimetype } =
      await this.arquivosService.obterConteudoParaStream(
        id,
        req.user.id,
        req.user.tipo,
      );

    res.setHeader('Content-Type', mimetype);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(nomeOriginal)}"`,
    );
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer);
  }

  @Patch(':id')
  @Roles(UserType.MEDICO)
  atualizar(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AtualizarArquivoDto,
  ): Promise<ArquivoResponseDto> {
    return this.arquivosService.atualizarDescricao(id, req.user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserType.MEDICO)
  async excluir(
    @Req() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.arquivosService.excluirArquivo(id, req.user.id);
  }
}
