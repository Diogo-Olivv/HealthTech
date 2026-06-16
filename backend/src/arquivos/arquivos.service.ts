import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Arquivo } from '../entities/arquivo.entity';
import { MedicoPaciente } from '../entities/medico-paciente.entity';
import { ArquivoResponseDto, toArquivoResponse } from './dto/arquivo-response.dto';
import { ListarArquivosResponseDto } from './dto/listar-arquivos-response.dto';

const CAMPOS_PUBLICOS = {
  id: true,
  nomeOriginal: true,
  tipo: true,
  tamanho: true,
  dataUpload: true,
  pacienteId: true,
  medicoUploadId: true,
} as const;

@Injectable()
export class ArquivosService {
  constructor(
    @InjectRepository(Arquivo)
    private readonly arquivosRepository: Repository<Arquivo>,
    @InjectRepository(MedicoPaciente)
    private readonly medicoPacienteRepository: Repository<MedicoPaciente>,
  ) {}


  toPublicArquivo(arquivo: Arquivo): ArquivoResponseDto {
    return toArquivoResponse(arquivo);
  }


  async listarParaPaciente(pacienteId: string): Promise<ListarArquivosResponseDto[]> {
    return this.arquivosRepository.find({
      select: CAMPOS_PUBLICOS,
      where: { pacienteId },
      order: { dataUpload: 'DESC' },
    }) as Promise<ListarArquivosResponseDto[]>;
  }

  
  async listarParaMedico(medicoId: string): Promise<ListarArquivosResponseDto[]> {
    const vinculos = await this.medicoPacienteRepository.find({
      select: { pacienteId: true },
      where: { medicoId },
    });

    const pacienteIds = vinculos.map((v) => v.pacienteId);


    if (!pacienteIds.length) {
      return [];
    }

    return this.arquivosRepository.find({
      select: CAMPOS_PUBLICOS,
      where: pacienteIds.map((pacienteId) => ({ pacienteId })),
      order: { dataUpload: 'DESC' },
    }) as Promise<ListarArquivosResponseDto[]>;
  }
}
