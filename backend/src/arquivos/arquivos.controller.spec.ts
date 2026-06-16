import { Test, TestingModule } from '@nestjs/testing';
import {
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
import { UserType } from '../entities/user.entity';
import { Arquivo } from '../entities/arquivo.entity';
import { ArquivoResponseDto } from './dto/arquivo-response.dto';

// ---------------------------------------------------------------------------
// Fábricas auxiliares
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Testes do ArquivosController
// ---------------------------------------------------------------------------

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
          },
        },
      ],
    })
      // Desabilitar os guards para isolar a lógica do controller nos testes unitários.
      // A validação dos guards é coberta nos testes E2E.
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

      expect(arquivosService.uploadArquivo).toHaveBeenCalledWith(
        file,
        pacienteId,
        req.user.id,
      );
      expect(resultado).toEqual(esperado);
      expect(resultado).not.toHaveProperty('caminhoStorage');
    });

    it('deve propagar exceção lançada pelo service', async () => {
      const file = makeMulterFile();
      const req = makeMedicoRequest();

      arquivosService.uploadArquivo.mockRejectedValue(new Error('Erro inesperado'));

      await expect(controller.upload(req as any, file, 'uuid-paciente-1')).rejects.toThrow(
        'Erro inesperado',
      );
    });
  });
});

// ---------------------------------------------------------------------------
// Testes unitários do ParseFilePipe (validação de tamanho e tipo)
// ---------------------------------------------------------------------------

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
