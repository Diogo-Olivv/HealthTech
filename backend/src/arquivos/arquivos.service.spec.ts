import { ForbiddenException } from '@nestjs/common';
import { ArquivosService } from './arquivos.service';
import { toArquivoResponse } from './dto/arquivo-response.dto';
import { Arquivo } from '../entities/arquivo.entity';

// ---------------------------------------------------------------------------
// Fábrica de entidade Arquivo com todos os campos preenchidos (incluindo o
// campo sensível caminhoStorage), para garantir que os testes validem a omissão.
// ---------------------------------------------------------------------------
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

// Fábrica de objeto Express.Multer.File para uso nos testes
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

// ---------------------------------------------------------------------------
// Testes de segurança — critério exclusivo: caminhoStorage NUNCA na resposta
// ---------------------------------------------------------------------------
describe('ArquivosService — segurança do caminhoStorage', () => {
  let service: ArquivosService;

  beforeEach(() => {
    // Repositório não é necessário para testar o mapeamento; usamos um mock vazio.
    const mockRepository = {} as any;
    const mockMedicoPacienteRepository = {} as any;
    const mockStorageService = {} as any;
    service = new ArquivosService(mockRepository, mockMedicoPacienteRepository, mockStorageService);
  });

  describe('toPublicArquivo()', () => {
    it('deve omitir o campo caminhoStorage da resposta', () => {
      const arquivo = makeArquivoEntity();

      const result = service.toPublicArquivo(arquivo);

      expect(result).not.toHaveProperty('caminhoStorage');
    });

    it('deve preservar todos os demais campos públicos do arquivo', () => {
      const arquivo = makeArquivoEntity();

      const result = service.toPublicArquivo(arquivo);

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

// ---------------------------------------------------------------------------
// Testes da função de mapeamento toArquivoResponse (mapper puro)
// ---------------------------------------------------------------------------
describe('toArquivoResponse() — mapper puro', () => {
  it('deve omitir o campo caminhoStorage', () => {
    const arquivo = makeArquivoEntity();

    const result = toArquivoResponse(arquivo);

    expect(result).not.toHaveProperty('caminhoStorage');
  });

  it('não deve vazar o valor do link de storage mesmo que populado', () => {
    const arquivo = makeArquivoEntity({
      caminhoStorage: 'https://storage.googleapis.com/bucket-secreto/arquivo-privado.pdf',
    });

    const result = toArquivoResponse(arquivo);

    expect(JSON.stringify(result)).not.toContain('bucket-secreto');
    expect(JSON.stringify(result)).not.toContain('arquivo-privado');
  });
});

// ---------------------------------------------------------------------------
// Testes do método uploadArquivo (lógica de negócio)
// ---------------------------------------------------------------------------
describe('ArquivosService.uploadArquivo()', () => {
  let service: ArquivosService;

  // Mocks compartilhados — serão reconfigurados em cada teste via mockImplementation
  const mockArquivosRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockMedicoPacienteRepo = {
    findOne: jest.fn(),
  };

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

    // Vínculo existe
    mockMedicoPacienteRepo.findOne.mockResolvedValue({ medicoId, pacienteId });
    mockStorageService.generateUniqueName.mockReturnValue(nomeUnico);
    mockStorageService.upload.mockResolvedValue(undefined);
    mockStorageService.getPublicUrl.mockReturnValue(urlGcs);
    mockArquivosRepo.create.mockReturnValue(arquivoSalvo);
    mockArquivosRepo.save.mockResolvedValue(arquivoSalvo);

    const result = await service.uploadArquivo(file, pacienteId, medicoId);

    // Verifica chamadas corretas
    expect(mockMedicoPacienteRepo.findOne).toHaveBeenCalledWith({
      where: { medicoId, pacienteId },
    });
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

    // Resultado não deve expor caminhoStorage
    expect(result).not.toHaveProperty('caminhoStorage');
    expect(result).toHaveProperty('id', 'uuid-arquivo-1');
    expect(result).toHaveProperty('nomeOriginal', 'exame_sangue.pdf');
  });

  it('deve lançar ForbiddenException quando médico não tem vínculo com o paciente', async () => {
    const file = makeMulterFile();

    // Nenhum vínculo encontrado
    mockMedicoPacienteRepo.findOne.mockResolvedValue(null);

    await expect(
      service.uploadArquivo(file, 'uuid-paciente-sem-vinculo', 'uuid-medico-1'),
    ).rejects.toThrow(ForbiddenException);

    // GCS não deve ter sido chamado
    expect(mockStorageService.upload).not.toHaveBeenCalled();
    expect(mockArquivosRepo.save).not.toHaveBeenCalled();
  });

  it('deve persistir o medicoUploadId correto', async () => {
    const file = makeMulterFile();
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

    await service.uploadArquivo(file, pacienteId, medicoId);

    expect(mockArquivosRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ medicoUploadId: medicoId }),
    );
  });
});
