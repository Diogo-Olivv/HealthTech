import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Arquivo } from '../entities/arquivo.entity';
import { MedicoPaciente } from '../entities/medico-paciente.entity';
import { StorageService } from '../storage/storage.service';
import { ArquivoResponseDto, toArquivoResponse } from './dto/arquivo-response.dto';

@Injectable()
export class ArquivosService {
  constructor(
    @InjectRepository(Arquivo)
    private readonly arquivosRepository: Repository<Arquivo>,
    @InjectRepository(MedicoPaciente)
    private readonly medicoPacienteRepository: Repository<MedicoPaciente>,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Retorna os metadados públicos de um arquivo, omitindo caminhoStorage.
   */
  toPublicArquivo(arquivo: Arquivo): ArquivoResponseDto {
    return toArquivoResponse(arquivo);
  }

  /**
   * Realiza o upload de um arquivo para o GCS e persiste os metadados no banco.
   * Regras:
   *  1. Valida vínculo médico-paciente — lança ForbiddenException se ausente.
   *  2. Gera nome único e envia ao GCS via StorageService.
   *  3. Persiste metadados na tabela 'arquivos'.
   *  4. Retorna resposta pública (sem caminhoStorage).
   */
  async uploadArquivo(
    file: Express.Multer.File,
    pacienteId: string,
    medicoId: string,
  ): Promise<ArquivoResponseDto> {
    // Regra 1 — verificar vínculo médico-paciente
    const vinculo = await this.medicoPacienteRepository.findOne({
      where: { medicoId, pacienteId },
    });

    if (!vinculo) {
      throw new ForbiddenException(
        'Médico não possui vínculo com o paciente informado',
      );
    }

    // Regra 2 — gerar nome único e fazer upload ao GCS
    const nomeUnico = this.storageService.generateUniqueName(file.originalname);
    await this.storageService.upload(file.buffer, nomeUnico, file.mimetype);
    const caminhoStorage = this.storageService.getPublicUrl(nomeUnico);

    // Regra 3 — persistir metadados
    const arquivo = this.arquivosRepository.create({
      nomeOriginal: file.originalname,
      nomeUnico,
      tamanho: file.size,
      tipo: file.mimetype,
      caminhoStorage,
      pacienteId,
      medicoUploadId: medicoId,
    });

    const salvo = await this.arquivosRepository.save(arquivo);

    // Regra 4 — retornar sem vazar caminhoStorage
    return this.toPublicArquivo(salvo);
  }
}
