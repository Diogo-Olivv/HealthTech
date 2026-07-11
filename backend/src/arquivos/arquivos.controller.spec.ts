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
    descricao: null,
    dataUpload: new Date('2026-06-12T00:00:00Z'),
    pacienteId: 'uuid-paciente-1',
    paciente: {} as any,
    medicoUploadId: 'uuid-medico-1',
    medicoUpload: {} as any,
  };
  return { ...base, ...overrides };
};

const makeRequest = (id: string, tipo: UserType) => ({ user: { id, tipo } });
const makeMedicoRequest = (id = 'uuid-medico-1') => makeRequest(id, UserType.MEDICO);
const makePacienteRequest = (id = 'uuid-paciente-1') => makeRequest(id, UserType.PACIENTE);

describe('ArquivosController', () => {
  let controller: ArquivosController;
  let arquivosService: jest.Mocked<ArquivosService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArquivosController],
      providers: [
        {
          provide: ArquivosService,
          useValue: {
            uploadArquivo: jest.fn(),
            gerarUrlDownload: jest.fn(),
            obterConteudoParaStream: jest.fn(),
            atualizarDescricao: jest.fn(),
            excluirArquivo: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ArquivosController>(ArquivosController);
    arquivosService = module.get(ArquivosService);
  });

  describe('upload()', () => {
    it('encaminha para o service com pacienteId, medicoId e descrição', async () => {
      const file = makeMulterFile();
      const req = makeMedicoRequest();
      arquivosService.uploadArquivo.mockResolvedValue(makePublicArquivo());

      await controller.upload(req as any, file, 'uuid-paciente-1', 'Hemograma');

      expect(arquivosService.uploadArquivo).toHaveBeenCalledWith(
        file,
        'uuid-paciente-1',
        'uuid-medico-1',
        'Hemograma',
      );
    });

    it('funciona sem descrição', async () => {
      arquivosService.uploadArquivo.mockResolvedValue(makePublicArquivo());

      await controller.upload(
        makeMedicoRequest() as any,
        makeMulterFile(),
        'uuid-paciente-1',
      );

      expect(arquivosService.uploadArquivo).toHaveBeenCalledWith(
        expect.anything(),
        'uuid-paciente-1',
        'uuid-medico-1',
        undefined,
      );
    });

    it('propaga exceção do service', async () => {
      arquivosService.uploadArquivo.mockRejectedValue(new Error('boom'));

      await expect(
        controller.upload(makeMedicoRequest() as any, makeMulterFile(), 'uuid-p'),
      ).rejects.toThrow('boom');
    });
  });

  describe('gerarUrlDownload()', () => {
    it('chama service com id do usuário e tipo (paciente)', async () => {
      arquivosService.gerarUrlDownload.mockResolvedValue({
        url: 'https://signed',
        expiresAt: new Date().toISOString(),
      });

      const result = await controller.gerarUrlDownload(
        makePacienteRequest() as any,
        'uuid-arquivo-1',
      );

      expect(arquivosService.gerarUrlDownload).toHaveBeenCalledWith(
        'uuid-arquivo-1',
        'uuid-paciente-1',
        UserType.PACIENTE,
      );
      expect(result.url).toBe('https://signed');
    });

    it('chama service com id do usuário e tipo (médico)', async () => {
      arquivosService.gerarUrlDownload.mockResolvedValue({
        url: 'https://signed',
        expiresAt: new Date().toISOString(),
      });

      await controller.gerarUrlDownload(makeMedicoRequest() as any, 'uuid-arquivo-1');

      expect(arquivosService.gerarUrlDownload).toHaveBeenCalledWith(
        'uuid-arquivo-1',
        'uuid-medico-1',
        UserType.MEDICO,
      );
    });
  });

  describe('streamArquivo()', () => {
    it('envia buffer com headers apropriados', async () => {
      arquivosService.obterConteudoParaStream.mockResolvedValue({
        buffer: Buffer.from('conteudo-bin'),
        nomeOriginal: 'meu exame.pdf',
        mimetype: 'application/pdf',
      });

      const headers: Record<string, unknown> = {};
      const res = {
        setHeader: jest.fn((k: string, v: unknown) => {
          headers[k] = v;
        }),
        end: jest.fn(),
      };

      await controller.streamArquivo(
        makePacienteRequest() as any,
        'uuid-arquivo-1',
        res as any,
      );

      expect(headers['Content-Type']).toBe('application/pdf');
      expect(headers['Content-Disposition']).toContain('meu%20exame.pdf');
      expect(res.end).toHaveBeenCalled();
    });
  });

  describe('atualizar()', () => {
    it('encaminha para atualizarDescricao com id do médico logado', async () => {
      arquivosService.atualizarDescricao.mockResolvedValue(
        makePublicArquivo({ descricao: 'Nova' }),
      );

      await controller.atualizar(
        makeMedicoRequest() as any,
        'uuid-arquivo-1',
        { descricao: 'Nova' },
      );

      expect(arquivosService.atualizarDescricao).toHaveBeenCalledWith(
        'uuid-arquivo-1',
        'uuid-medico-1',
        { descricao: 'Nova' },
      );
    });
  });

  describe('excluir()', () => {
    it('encaminha para excluirArquivo com id do médico logado', async () => {
      arquivosService.excluirArquivo.mockResolvedValue(undefined);

      await controller.excluir(makeMedicoRequest() as any, 'uuid-arquivo-1');

      expect(arquivosService.excluirArquivo).toHaveBeenCalledWith(
        'uuid-arquivo-1',
        'uuid-medico-1',
      );
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

  it.each([
    ['application/pdf', 1024],
    ['image/jpeg', 512 * 1024],
    ['image/png', 2 * 1024 * 1024],
  ])('aceita %s dentro do limite', async (mimetype, size) => {
    const file = makeMulterFile({ mimetype, size });
    await expect(pipe.transform(file)).resolves.toBe(file);
  });

  it('rejeita arquivo acima de 10 MB', async () => {
    await expect(pipe.transform(makeMulterFile({ size: DEZ_MB + 1 }))).rejects.toThrow(
      UnprocessableEntityException,
    );
  });

  it('rejeita mimetype não permitido', async () => {
    await expect(
      pipe.transform(makeMulterFile({ mimetype: 'video/mp4', originalname: 'v.mp4' })),
    ).rejects.toThrow(UnprocessableEntityException);
  });
});
