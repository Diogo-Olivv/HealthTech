import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Arquivo } from '../entities/arquivo.entity';
import {
  MedicoPaciente,
  StatusVinculo,
} from '../entities/medico-paciente.entity';
import { UserType } from '../entities/user.entity';
import { StorageService } from '../storage/storage.service';
import { AtualizarArquivoDto } from './dto/atualizar-arquivo.dto';
import {
  ArquivoResponseDto,
  toArquivoResponse,
} from './dto/arquivo-response.dto';
import { ListarArquivosResponseDto } from './dto/listar-arquivos-response.dto';

const LISTAGEM_RELATIONS = {
  paciente: { user: true },
  medicoUpload: { user: true },
} as const;

function toListagemDto(arquivo: Arquivo): ListarArquivosResponseDto {
  return {
    id: arquivo.id,
    nomeOriginal: arquivo.nomeOriginal,
    tipo: arquivo.tipo,
    tamanho: arquivo.tamanho,
    dataUpload: arquivo.dataUpload,
    descricao: arquivo.descricao ?? null,
    pacienteId: arquivo.pacienteId,
    pacienteNome: arquivo.paciente?.user?.name ?? '',
    medicoUploadId: arquivo.medicoUploadId,
    medicoNome: arquivo.medicoUpload?.user?.name ?? '',
  };
}

@Injectable()
export class ArquivosService {
  private readonly logger = new Logger(ArquivosService.name);

  constructor(
    @InjectRepository(Arquivo)
    private readonly arquivosRepository: Repository<Arquivo>,
    @InjectRepository(MedicoPaciente)
    private readonly medicoPacienteRepository: Repository<MedicoPaciente>,
    private readonly storageService: StorageService,
  ) {}

  toPublicArquivo(arquivo: Arquivo): ArquivoResponseDto {
    return toArquivoResponse(arquivo);
  }

  async listarParaPaciente(
    pacienteId: string,
  ): Promise<ListarArquivosResponseDto[]> {
    const arquivos = await this.arquivosRepository.find({
      where: { pacienteId },
      relations: LISTAGEM_RELATIONS,
      order: { dataUpload: 'DESC' },
    });
    return arquivos.map(toListagemDto);
  }

  async listarParaMedico(
    medicoId: string,
  ): Promise<ListarArquivosResponseDto[]> {
    const vinculos = await this.medicoPacienteRepository.find({
      select: { pacienteId: true },
      where: { medicoId, status: StatusVinculo.APROVADO },
    });

    const pacienteIds = vinculos.map((v) => v.pacienteId);
    if (!pacienteIds.length) return [];

    const arquivos = await this.arquivosRepository.find({
      where: pacienteIds.map((pacienteId) => ({
        pacienteId,
        medicoUploadId: medicoId,
      })),
      relations: LISTAGEM_RELATIONS,
      order: { dataUpload: 'DESC' },
    });
    return arquivos.map(toListagemDto);
  }

  async listarProntuarioPaciente(
    medicoId: string,
    pacienteId: string,
  ): Promise<ListarArquivosResponseDto[]> {
    const vinculo = await this.medicoPacienteRepository.findOne({
      where: { medicoId, pacienteId, status: StatusVinculo.APROVADO },
    });

    if (!vinculo) {
      throw new ForbiddenException(
        'Médico não possui vínculo aprovado com este paciente para acessar o prontuário.',
      );
    }

    const arquivos = await this.arquivosRepository.find({
      where: { pacienteId },
      relations: LISTAGEM_RELATIONS,
      order: { dataUpload: 'DESC' },
    });

    return arquivos.map(toListagemDto);
  }

  async uploadArquivo(
    file: Express.Multer.File,
    pacienteId: string,
    medicoId: string,
    descricao?: string,
  ): Promise<ArquivoResponseDto> {
    const vinculo = await this.medicoPacienteRepository.findOne({
      where: { medicoId, pacienteId, status: StatusVinculo.APROVADO },
    });

    if (!vinculo) {
      throw new ForbiddenException(
        'Médico não possui vínculo aprovado com o paciente informado.',
      );
    }

    const nomeUnico = this.storageService.generateUniqueName(file.originalname);
    await this.storageService.upload(file.buffer, nomeUnico, file.mimetype);
    const caminhoStorage = this.storageService.getPublicUrl(nomeUnico);

    const arquivo = this.arquivosRepository.create({
      nomeOriginal: file.originalname,
      nomeUnico,
      tamanho: file.size,
      tipo: file.mimetype,
      descricao: descricao?.trim() || null,
      caminhoStorage,
      pacienteId,
      medicoUploadId: medicoId,
    });

    const salvo = await this.arquivosRepository.save(arquivo);

    return this.toPublicArquivo(salvo);
  }

  async obterConteudoParaStream(
    arquivoId: string,
    usuarioId: string,
    tipoUsuario: UserType,
  ): Promise<{ buffer: Buffer; nomeOriginal: string; mimetype: string }> {
    const arquivo = await this.buscarArquivoOuFalhar(arquivoId);
    await this.garantirAcessoDeLeitura(arquivo, usuarioId, tipoUsuario);

    const buffer = await this.storageService.download(arquivo.nomeUnico);
    return {
      buffer,
      nomeOriginal: arquivo.nomeOriginal,
      mimetype: arquivo.tipo,
    };
  }

  async atualizarDescricao(
    arquivoId: string,
    medicoId: string,
    dto: AtualizarArquivoDto,
  ): Promise<ArquivoResponseDto> {
    const arquivo = await this.buscarArquivoOuFalhar(arquivoId);
    this.garantirDonoDoUpload(arquivo, medicoId);
    await this.garantirVinculoAprovado(medicoId, arquivo.pacienteId);

    arquivo.descricao = dto.descricao?.trim() || null;

    const atualizado = await this.arquivosRepository.save(arquivo);
    return this.toPublicArquivo(atualizado);
  }

  async excluirArquivo(arquivoId: string, medicoId: string): Promise<void> {
    const arquivo = await this.buscarArquivoOuFalhar(arquivoId);
    this.garantirDonoDoUpload(arquivo, medicoId);
    await this.garantirVinculoAprovado(medicoId, arquivo.pacienteId);

    await this.storageService.delete(arquivo.nomeUnico);

    try {
      await this.arquivosRepository.delete({ id: arquivo.id });
    } catch (err) {
      this.logger.error(
        `Falha ao remover registro do arquivo ${arquivo.id} após delete no storage`,
        (err as Error).stack,
      );
      throw err;
    }
  }

  private async buscarArquivoOuFalhar(arquivoId: string): Promise<Arquivo> {
    const arquivo = await this.arquivosRepository.findOne({
      where: { id: arquivoId },
    });
    if (!arquivo) {
      throw new NotFoundException('Arquivo não encontrado.');
    }
    return arquivo;
  }

  private async garantirAcessoDeLeitura(
    arquivo: Arquivo,
    usuarioId: string,
    tipoUsuario: UserType,
  ): Promise<void> {
    if (tipoUsuario === UserType.PACIENTE) {
      if (arquivo.pacienteId !== usuarioId) {
        throw new ForbiddenException('Você não tem acesso a este arquivo.');
      }
      return;
    }

    if (tipoUsuario === UserType.MEDICO) {
      const vinculo = await this.medicoPacienteRepository.findOne({
        where: {
          medicoId: usuarioId,
          pacienteId: arquivo.pacienteId,
          status: StatusVinculo.APROVADO,
        },
      });
      if (!vinculo) {
        throw new ForbiddenException(
          'Médico não possui vínculo aprovado com o paciente deste arquivo.',
        );
      }
      return;
    }

    throw new ForbiddenException('Tipo de usuário não autorizado.');
  }

  private garantirDonoDoUpload(arquivo: Arquivo, medicoId: string): void {
    if (arquivo.medicoUploadId !== medicoId) {
      throw new ForbiddenException(
        'Somente o médico que enviou o arquivo pode alterá-lo ou removê-lo.',
      );
    }
  }

  private async garantirVinculoAprovado(
    medicoId: string,
    pacienteId: string,
  ): Promise<void> {
    const vinculo = await this.medicoPacienteRepository.findOne({
      where: { medicoId, pacienteId, status: StatusVinculo.APROVADO },
    });
    if (!vinculo) {
      throw new ForbiddenException(
        'Médico não possui vínculo aprovado com o paciente deste arquivo.',
      );
    }
  }
}
