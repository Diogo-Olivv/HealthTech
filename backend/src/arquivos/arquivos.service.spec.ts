import { ForbiddenException } from '@nestjs/common';
import { ArquivosService } from './arquivos.service';
import { toArquivoResponse } from './dto/arquivo-response.dto';
import { Arquivo } from '../entities/arquivo.entity';

const makeArquivoEntity = (overrides: Partial<Arquivo> = {}): Arquivo => ({
  id: 'uuid-arquivo-1',
  nomeOriginal: 'exame_sangue.pdf',
  nomeUnico: 'uuid-gerado-exame_sangue.pdf',
  tipo: 'application/pdf',
  tamanho: 204800,
  caminhoStorage: 'https://storage.googleapis.com/bucket/uuid-gerado-exame_sangue.pdf',
  dataUpload: new Date('2026-06-12T00:00:00Z'),
  pacienteId: 'uuid-paciente-1',
  paciente: {} as any,
  medicoUploadId: 'uuid-medico-1',
  medicoUpload: {} as any,
  ...overrides,
});

const makeMulterFile = (overrides: Partial<Express.Multer.File> = {}): Express.Multer.File =>
  ({
    fieldname: 'arquivo',
    originalname: 'exame_sangue.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    buffer: Buffer.from('conteudo fake do pdf'),
    size: 204800,
    ...overrides,
  }) as Express.Multer.File;

describe('ArquivosService — segurança do caminhoStorage', () => {
  let service: ArquivosService;

  beforeEach(() => {
    service = new ArquivosService({} as any, {} as any, {} as any);
  });

  describe('toPublicArquivo()', () => {
    it('deve omitir o campo caminhoStorage da resposta', () => {
      const result = service.toPublicArquivo(makeArquivoEntity());
      expect(result).not.toHaveProperty('caminhoStorage');
    });

    it('deve preservar todos os demais campos públicos do arquivo', () => {
      const result = service.toPublicArquivo(makeArquivoEntity());
      expect(result).toMatchObject({
        id: 'uuid-arquivo-1',
        nomeOriginal: 'exame_sangue.pdf',
        nomeUnico: 'uuid-gerado-exame_sangue.pdf',
        tipo: 'application/pdf',
        tamanho: 204800,
        pacienteId: 'uuid-paciente-1',
        medicoUploadId: 'uuid-medico-1',
      });
    });
  });
});

describe('toArquivoResponse() — mapper puro', () => {
  it('deve omitir o campo caminhoStorage', () => {
    const result = toArquivoResponse(makeArquivoEntity());
    expect(result).not.toHaveProperty('caminhoStorage');
  });

  it('não deve vazar o valor do link de storage mesmo que populado', () => {
    const result = toArquivoResponse(
      makeArquivoEntity({
        caminhoStorage: 'https://storage.googleapis.com/bucket-secreto/arquivo-privado.pdf',
      }),
    );
    expect(JSON.stringify(result)).not.toContain('bucket-secreto');
    expect(JSON.stringify(result)).not.toContain('arquivo-privado');
  });
});

describe('ArquivosService.uploadArquivo()', () => {
  let service: ArquivosService;

  const mockArquivosRepo = { create: jest.fn(), save: jest.fn() };
  const mockMedicoPacienteRepo = { findOne: jest.fn() };
  const mockStorageService = {
    generateUniqueName: jest.fn(),
    upload: jest.fn(),
    getPublicUrl: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ArquivosService(
      mockArquivosRepo as any,
      mockMedicoPacienteRepo as any,
      mockStorageService as any,
    );
  });

  it('deve fazer o upload com sucesso e retornar o arquivo sem caminhoStorage', async () => {
    const file = makeMulterFile();
    const pacienteId = 'uuid-paciente-1';
    const medicoId = 'uuid-medico-1';
    const nomeUnico = 'uuid-gerado-exame_sangue.pdf';
    const urlGcs = 'https://storage.googleapis.com/bucket/uuid-gerado-exame_sangue.pdf';
    const arquivoSalvo = makeArquivoEntity({ nomeUnico, caminhoStorage: urlGcs });

    mockMedicoPacienteRepo.findOne.mockResolvedValue({ medicoId, pacienteId });
    mockStorageService.generateUniqueName.mockReturnValue(nomeUnico);
    mockStorageService.upload.mockResolvedValue(undefined);
    mockStorageService.getPublicUrl.mockReturnValue(urlGcs);
    mockArquivosRepo.create.mockReturnValue(arquivoSalvo);
    mockArquivosRepo.save.mockResolvedValue(arquivoSalvo);

    const result = await service.uploadArquivo(file, pacienteId, medicoId);

    expect(mockMedicoPacienteRepo.findOne).toHaveBeenCalledWith({ where: { medicoId, pacienteId } });
    expect(mockStorageService.generateUniqueName).toHaveBeenCalledWith(file.originalname);
    expect(mockStorageService.upload).toHaveBeenCalledWith(file.buffer, nomeUnico, file.mimetype);
    expect(mockArquivosRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        nomeOriginal: file.originalname,
        nomeUnico,
        tamanho: file.size,
        tipo: file.mimetype,
        caminhoStorage: urlGcs,
        pacienteId,
        medicoUploadId: medicoId,
      }),
    );
    expect(mockArquivosRepo.save).toHaveBeenCalled();
    expect(result).not.toHaveProperty('caminhoStorage');
    expect(result).toHaveProperty('id', 'uuid-arquivo-1');
    expect(result).toHaveProperty('nomeOriginal', 'exame_sangue.pdf');
  });

  it('deve lançar ForbiddenException quando médico não tem vínculo com o paciente', async () => {
    mockMedicoPacienteRepo.findOne.mockResolvedValue(null);

    await expect(
      service.uploadArquivo(makeMulterFile(), 'uuid-paciente-sem-vinculo', 'uuid-medico-1'),
    ).rejects.toThrow(ForbiddenException);

    expect(mockStorageService.upload).not.toHaveBeenCalled();
    expect(mockArquivosRepo.save).not.toHaveBeenCalled();
  });

  it('deve persistir o medicoUploadId correto', async () => {
    const pacienteId = 'uuid-paciente-1';
    const medicoId = 'uuid-medico-abc';
    const nomeUnico = 'novo-nome-unico.pdf';
    const arquivoSalvo = makeArquivoEntity({ medicoUploadId: medicoId, nomeUnico });

    mockMedicoPacienteRepo.findOne.mockResolvedValue({ medicoId, pacienteId });
    mockStorageService.generateUniqueName.mockReturnValue(nomeUnico);
    mockStorageService.upload.mockResolvedValue(undefined);
    mockStorageService.getPublicUrl.mockReturnValue('https://gcs/fake.pdf');
    mockArquivosRepo.create.mockReturnValue(arquivoSalvo);
    mockArquivosRepo.save.mockResolvedValue(arquivoSalvo);

    await service.uploadArquivo(makeMulterFile(), pacienteId, medicoId);

    expect(mockArquivosRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ medicoUploadId: medicoId }),
    );
  });
});
