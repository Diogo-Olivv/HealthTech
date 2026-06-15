import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Arquivo } from '../entities/arquivo.entity';
import { ArquivoResponseDto, toArquivoResponse } from './dto/arquivo-response.dto';

@Injectable()
export class ArquivosService {
  constructor(
    @InjectRepository(Arquivo)
    private readonly arquivosRepository: Repository<Arquivo>,
  ) {}

  /**
   * Retorna os metadados públicos de um arquivo, omitindo caminhoStorage.
   */
  toPublicArquivo(arquivo: Arquivo): ArquivoResponseDto {
    return toArquivoResponse(arquivo);
  }

  // Os métodos de upload, listagem e deleção serão implementados nas próximas issues.
}
