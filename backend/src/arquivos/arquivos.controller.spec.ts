import { Test, TestingModule } from '@nestjs/testing';
import {
  ForbiddenException,
  HttpStatus,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ArquivosController } from './arquivos.controller';
import { ArquivosService } from './arquivos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { AUDIT_METADATA_KEY, AuditConfig } from '../audit/audit.decorator';
import { TipoEventoAuditoria } from '../entities/audit-log/audit-log.entity';
import { UserType } from '../entities/user.entity';
import { Arquivo } from '../entities/arquivo.entity';
import { ArquivoResponseDto } from './dto/arquivo-response.dto';
import type { Request } from 'express';

const makeMulterFile = (overrides: Partial<Express.Multer.File> = {}): Express.Multer.File =>
  ({
    fieldname: 'arquivo',
    originalname: 'exame.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    buffer: Buffer.from('fake pdf content'),
    size: 1024,
    ...overrides,
  }) as Express.Multer.File;

const makePublicArquivo = (overrides: Partial<ArquivoResponseDto> = {}): ArquivoResponseDto => {
  const base: Omit<Arquivo, 'caminhoStorage'> = {
    id: 'uuid-arquivo-1',
    nomeOriginal: 'exame.pdf',
    nomeUnico: 'gerado-exame.pdf',
    tipo: 'application/pdf',
    tamanho: 1024,
    dataUpload: new Date('2026-06-12T00:00:00Z'),
    pacienteId: 'uuid-paciente-1',
    paciente: {} as any,
    medicoUploadId: 'uuid-medico-1',
    medicoUpload: {} as any,
  };
  return { ...base, ...overrides };
};

const makeMedicoRequest = (id = 'uuid-medico-1') => ({
  user: { id, tipo: UserType.MEDICO },
});

describe('ArquivosController', () => {
  let controller: ArquivosController;
  let arquivosService: jest.Mocked<ArquivosService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArquivosController],
      providers: [{ provide: ArquivosService, useValue: { uploadArquivo: jest.fn() } }],
    })
      // Guards desabilitados para isolar o controller; a lógica de autorização é coberta nos E2E.
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ArquivosController>(ArquivosController);
    arquivosService = module.get(ArquivosService);
  });

  describe('upload()', () => {
    it('deve chamar arquivosService.uploadArquivo com os parâmetros corretos e retornar o DTO público', async () => {
      const file = makeMulterFile();
      const req = makeMedicoRequest();
      const pacienteId = 'uuid-paciente-1';
      const esperado = makePublicArquivo();

      arquivosService.uploadArquivo.mockResolvedValue(esperado);

      const resultado = await controller.upload(req as any, file, pacienteId);

      expect(arquivosService.uploadArquivo).toHaveBeenCalledWith(file, pacienteId, req.user.id);
      expect(resultado).toEqual(esperado);
      expect(resultado).not.toHaveProperty('caminhoStorage');
    });

    it('deve propagar exceção lançada pelo service', async () => {
      arquivosService.uploadArquivo.mockRejectedValue(new Error('Erro inesperado'));

      await expect(
        controller.upload(makeMedicoRequest() as any, makeMulterFile(), 'uuid-paciente-1'),
      ).rejects.toThrow('Erro inesperado');
    });

    it('deve propagar ForbiddenException para o interceptor registrar FAILURE', async () => {
      arquivosService.uploadArquivo.mockRejectedValue(
        new ForbiddenException('Médico não possui vínculo com o paciente informado'),
      );

      await expect(
        controller.upload(makeMedicoRequest() as any, makeMulterFile(), 'uuid-paciente-sem-vinculo'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('@Audit metadata', () => {
    it('listar() deve ter @Audit com VISUALIZACAO_ARQUIVO e extrair userId do request', () => {
      const metadata: AuditConfig = Reflect.getMetadata(
        AUDIT_METADATA_KEY,
        ArquivosController.prototype.listar,
      );

      expect(metadata).toBeDefined();
      expect(metadata.evento).toBe(TipoEventoAuditoria.VISUALIZACAO_ARQUIVO);

      const fakeReq = { user: { id: 'user-abc' } } as unknown as Request;
      expect(metadata.extractRecursoId!(null, fakeReq)).toBe('user-abc');
    });

    it('upload() deve ter @Audit com UPLOAD_ARQUIVO e extrair pacienteId do body', () => {
      const metadata: AuditConfig = Reflect.getMetadata(
        AUDIT_METADATA_KEY,
        ArquivosController.prototype.upload,
      );

      expect(metadata).toBeDefined();
      expect(metadata.evento).toBe(TipoEventoAuditoria.UPLOAD_ARQUIVO);

      const fakeReq = { body: { pacienteId: 'pac-123' } } as unknown as Request;
      expect(metadata.extractRecursoId!(null, fakeReq)).toBe('pac-123');
    });

    it('extractRecursoId do upload deve retornar null quando body não contém pacienteId', () => {
      const metadata: AuditConfig = Reflect.getMetadata(
        AUDIT_METADATA_KEY,
        ArquivosController.prototype.upload,
      );

      const fakeReq = { body: {} } as unknown as Request;
      expect(metadata.extractRecursoId!(null, fakeReq)).toBeNull();
    });
  });
});

describe('ParseFilePipe — validação de arquivo', () => {
  const DEZ_MB = 10 * 1024 * 1024;

  let pipe: ParseFilePipe;

  beforeEach(() => {
    pipe = new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: DEZ_MB }),
        new FileTypeValidator({
          fileType: /^(application\/pdf|image\/(jpeg|png))$/,
          fallbackToMimetype: true,
        }),
      ],
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });
  });

  it('deve aceitar um arquivo PDF dentro do limite de tamanho', async () => {
    const file = makeMulterFile({ mimetype: 'application/pdf', size: 1024 });
    await expect(pipe.transform(file)).resolves.toBe(file);
  });

  it('deve aceitar um arquivo image/jpeg dentro do limite de tamanho', async () => {
    const file = makeMulterFile({ mimetype: 'image/jpeg', size: 512 * 1024 });
    await expect(pipe.transform(file)).resolves.toBe(file);
  });

  it('deve aceitar um arquivo image/png dentro do limite de tamanho', async () => {
    const file = makeMulterFile({ mimetype: 'image/png', size: 2 * 1024 * 1024 });
    await expect(pipe.transform(file)).resolves.toBe(file);
  });

  it('deve rejeitar arquivo com tamanho acima de 10 MB', async () => {
    const file = makeMulterFile({ size: DEZ_MB + 1 });
    await expect(pipe.transform(file)).rejects.toThrow(UnprocessableEntityException);
  });

  it('deve rejeitar arquivo com formato não permitido (ex: video/mp4)', async () => {
    const file = makeMulterFile({ mimetype: 'video/mp4', originalname: 'video.mp4' });
    await expect(pipe.transform(file)).rejects.toThrow(UnprocessableEntityException);
  });

  it('deve rejeitar arquivo text/plain mesmo dentro do limite de tamanho', async () => {
    const file = makeMulterFile({ mimetype: 'text/plain', originalname: 'notas.txt', size: 100 });
    await expect(pipe.transform(file)).rejects.toThrow(UnprocessableEntityException);
  });
});
