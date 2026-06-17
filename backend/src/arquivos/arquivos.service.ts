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

  toPublicArquivo(arquivo: Arquivo): ArquivoResponseDto {
    return toArquivoResponse(arquivo);
  }

  async uploadArquivo(
    file: Express.Multer.File,
    pacienteId: string,
    medicoId: string,
  ): Promise<ArquivoResponseDto> {
    const vinculo = await this.medicoPacienteRepository.findOne({
      where: { medicoId, pacienteId },
    });

    if (!vinculo) {
      throw new ForbiddenException('Médico não possui vínculo com o paciente informado');
    }

    const nomeUnico = this.storageService.generateUniqueName(file.originalname);
    await this.storageService.upload(file.buffer, nomeUnico, file.mimetype);
    const caminhoStorage = this.storageService.getPublicUrl(nomeUnico);

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

    return this.toPublicArquivo(salvo);
  }
}
