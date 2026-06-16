import { ArquivosService } from './arquivos.service';
import { toArquivoResponse } from './dto/arquivo-response.dto';
import { Arquivo } from '../entities/arquivo.entity';
import { MedicoPaciente } from '../entities/medico-paciente.entity';
import { Repository } from 'typeorm';

// ---------------------------------------------------------------------------
// Fábrica de entidade Arquivo com todos os campos preenchidos (incluindo o
// campo sensível caminhoStorage), para garantir que os testes validem a omissão.
// ---------------------------------------------------------------------------
const makeArquivoEntity = (overrides: Partial<Arquivo> = {}): Arquivo => ({
  id: 'uuid-arquivo-1',
  nomeOriginal: 'exame_sangue.pdf',
  nomeUnico: 'uuid-arquivo-1-exame_sangue.pdf',
  tipo: 'application/pdf',
  tamanho: 204800,
  caminhoStorage: 'https://storage.googleapis.com/bucket/uuid-arquivo-1-exame_sangue.pdf',
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
describe('ArquivosService — segurança do caminhoStorage', () => {
  let service: ArquivosService;

  beforeEach(() => {
    // Repositório não é necessário para testar o mapeamento; usamos um mock vazio.
    const mockRepository = {} as any;
    service = new ArquivosService(mockRepository, mockRepository);
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
        nomeUnico: 'uuid-arquivo-1-exame_sangue.pdf',
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
