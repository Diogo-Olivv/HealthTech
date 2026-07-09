import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Especialidade } from '../entities/especialidade.entity';
import { EspecialidadeResponseDto } from './dto/especialidade-response.dto';

@Injectable()
export class EspecialidadesService {
  constructor(
    @InjectRepository(Especialidade)
    private readonly repo: Repository<Especialidade>,
  ) {}

  async listarAtivas(): Promise<EspecialidadeResponseDto[]> {
    const linhas = await this.repo.find({
      where: { ativa: true },
      order: { nome: 'ASC' },
    });
    return linhas.map(({ id, nome, slug }) => ({ id, nome, slug }));
  }

  async buscarPorIds(ids: string[]): Promise<Especialidade[]> {
    if (!ids.length) return [];
    return this.repo.find({
      where: { id: In(ids), ativa: true },
    });
  }
}
