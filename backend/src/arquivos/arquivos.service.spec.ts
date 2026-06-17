import { ForbiddenException } from '@nestjs/common';
import { ArquivosService } from './arquivos.service';
import { toArquivoResponse } from './dto/arquivo-response.dto';
import { Arquivo } from '../entities/arquivo.entity';
import { MedicoPaciente } from '../entities/medico-paciente.entity';
import { Repository } from 'typeorm';

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

// ---------------------------------------------------------------------------
// Helper para montar um mock de Repository<T> apenas com os métodos usados
// ---------------------------------------------------------------------------
const mockRepo = <T>(overrides: Partial<Repository<T>> = {}): Repository<T> =>
  ({
    find: jest.fn(),
    ...overrides,
  }) as unknown as Repository<T>;

// ---------------------------------------------------------------------------
// Testes de segurança — critério exclusivo: caminhoStorage NUNCA na resposta
// ---------------------------------------------------------------------------
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
    // Repositório não é necessário para testar o mapeamento; usamos um mock vazio.
    const mockRepository = {} as any;
    service = new ArquivosService(mockRepository, mockRepository);
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

// ---------------------------------------------------------------------------
// Testes unitários — listarParaPaciente()
// ---------------------------------------------------------------------------
describe('ArquivosService — listarParaPaciente()', () => {
  let service: ArquivosService;
  let arquivosRepo: jest.Mocked<Repository<Arquivo>>;
  let medicoPacienteRepo: jest.Mocked<Repository<MedicoPaciente>>;

  beforeEach(() => {
    arquivosRepo = mockRepo<Arquivo>() as jest.Mocked<Repository<Arquivo>>;
    medicoPacienteRepo = mockRepo<MedicoPaciente>() as jest.Mocked<Repository<MedicoPaciente>>;
    service = new ArquivosService(arquivosRepo, medicoPacienteRepo);
  });

  it('deve retornar apenas os arquivos do paciente informado', async () => {
    const arquivoDoPaciente = makeArquivoEntity({ pacienteId: 'uuid-paciente-1' });
    arquivosRepo.find.mockResolvedValueOnce([arquivoDoPaciente]);

    const result = await service.listarParaPaciente('uuid-paciente-1');

    expect(arquivosRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: { pacienteId: 'uuid-paciente-1' } }),
    );
    expect(result).toHaveLength(1);
    expect(result[0].pacienteId).toBe('uuid-paciente-1');
  });

  it('deve retornar array vazio quando o paciente não possui arquivos', async () => {
    arquivosRepo.find.mockResolvedValueOnce([]);

    const result = await service.listarParaPaciente('uuid-paciente-sem-arquivos');

    expect(result).toEqual([]);
  });

  it('nunca deve incluir caminhoStorage nos resultados', async () => {
    const arquivoComCaminho = makeArquivoEntity();
    arquivosRepo.find.mockResolvedValueOnce([arquivoComCaminho]);

    const result = await service.listarParaPaciente('uuid-paciente-1');

    // O select explícito no TypeORM já impede isso em produção,
    // mas validamos que o contrato do método nunca expõe o campo.
    result.forEach((item) => {
      expect(item).not.toHaveProperty('caminhoStorage');
    });
  });
});

// ---------------------------------------------------------------------------
// Testes unitários — listarParaMedico()
// ---------------------------------------------------------------------------
describe('ArquivosService — listarParaMedico()', () => {
  let service: ArquivosService;
  let arquivosRepo: jest.Mocked<Repository<Arquivo>>;
  let medicoPacienteRepo: jest.Mocked<Repository<MedicoPaciente>>;

  const makeVinculo = (pacienteId: string): MedicoPaciente =>
    ({
      medicoId: 'uuid-medico-1',
      pacienteId,
      medico: {} as any,
      paciente: {} as any,
      vinculadoEm: new Date(),
    }) as MedicoPaciente;

  beforeEach(() => {
    arquivosRepo = mockRepo<Arquivo>() as jest.Mocked<Repository<Arquivo>>;
    medicoPacienteRepo = mockRepo<MedicoPaciente>() as jest.Mocked<Repository<MedicoPaciente>>;
    service = new ArquivosService(arquivosRepo, medicoPacienteRepo);
  });

  it('deve retornar APENAS arquivos de pacientes vinculados ao médico', async () => {
    const pacienteVinculado = 'uuid-paciente-vinculado';
    medicoPacienteRepo.find.mockResolvedValueOnce([makeVinculo(pacienteVinculado)]);

    const arquivoDoVinculado = makeArquivoEntity({ pacienteId: pacienteVinculado });
    arquivosRepo.find.mockResolvedValueOnce([arquivoDoVinculado]);

    const result = await service.listarParaMedico('uuid-medico-1');

    expect(result).toHaveLength(1);
    expect(result[0].pacienteId).toBe(pacienteVinculado);
  });

  it('NÃO deve retornar arquivos de pacientes não vinculados ao médico', async () => {
    const pacienteVinculado = 'uuid-paciente-vinculado';
    const pacienteNaoVinculado = 'uuid-paciente-NAO-vinculado';

    // Médico possui vínculo apenas com pacienteVinculado
    medicoPacienteRepo.find.mockResolvedValueOnce([makeVinculo(pacienteVinculado)]);

    // O banco retorna apenas arquivos do paciente vinculado (WHERE IN correto)
    const arquivoDoVinculado = makeArquivoEntity({ pacienteId: pacienteVinculado });
    arquivosRepo.find.mockResolvedValueOnce([arquivoDoVinculado]);

    const result = await service.listarParaMedico('uuid-medico-1');

    // Garante que nenhum arquivo do paciente não vinculado aparece
    const pacienteIdsNoResultado = result.map((a) => a.pacienteId);
    expect(pacienteIdsNoResultado).not.toContain(pacienteNaoVinculado);

    // Confirma que a query foi feita somente com o ID do paciente vinculado
    expect(arquivosRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: [{ pacienteId: pacienteVinculado }],
      }),
    );
  });

  it('deve retornar array vazio se o médico não possuir nenhum paciente vinculado (edge case)', async () => {
    // Médico recém-cadastrado: nenhum vínculo na tabela medico_paciente
    medicoPacienteRepo.find.mockResolvedValueOnce([]);

    const result = await service.listarParaMedico('uuid-medico-sem-vinculos');

    // Early return deve evitar a chamada ao repositório de arquivos
    expect(result).toEqual([]);
    expect(arquivosRepo.find).not.toHaveBeenCalled();
  });

  it('deve retornar array vazio se o médico estiver vinculado mas os pacientes não tiverem arquivos', async () => {
    medicoPacienteRepo.find.mockResolvedValueOnce([makeVinculo('uuid-paciente-sem-arquivos')]);
    arquivosRepo.find.mockResolvedValueOnce([]);

    const result = await service.listarParaMedico('uuid-medico-1');

    expect(result).toEqual([]);
  });

  it('nunca deve incluir caminhoStorage nos resultados', async () => {
    medicoPacienteRepo.find.mockResolvedValueOnce([makeVinculo('uuid-paciente-1')]);
    arquivosRepo.find.mockResolvedValueOnce([makeArquivoEntity()]);

    const result = await service.listarParaMedico('uuid-medico-1');

    result.forEach((item) => {
      expect(item).not.toHaveProperty('caminhoStorage');
    });
  });
});
