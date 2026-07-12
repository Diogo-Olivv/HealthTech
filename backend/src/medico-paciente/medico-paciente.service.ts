import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Request } from 'express';
import { QueryFailedError, Repository } from 'typeorm';
import { AuditLogService } from '../audit/audit-log.service';
import {
  StatusAuditoria,
  TipoEventoAuditoria,
} from '../entities/audit-log/audit-log.entity';
import {
  MedicoPaciente,
  StatusVinculo,
} from '../entities/medico-paciente.entity';
import { Medico } from '../entities/medico.entity';
import { Paciente } from '../entities/paciente.entity';

const POSTGRES_UNIQUE_VIOLATION = '23505';
const COOLDOWN_APOS_REJEICAO_MS = 24 * 60 * 60 * 1000;

/** Versão do termo de consentimento gravada no aceite (LGPD Art. 8º). */
export const TERMO_CONSENTIMENTO_VERSAO = 'v1';

@Injectable()
export class MedicoPacienteService {
  constructor(
    @InjectRepository(MedicoPaciente)
    private readonly repo: Repository<MedicoPaciente>,
    @InjectRepository(Paciente)
    private readonly pacienteRepo: Repository<Paciente>,
    @InjectRepository(Medico)
    private readonly medicoRepo: Repository<Medico>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async solicitarVinculo(
    medicoId: string,
    pacienteId: string,
    request: Request,
  ): Promise<void> {
    const paciente = await this.pacienteRepo.findOne({
      where: { userId: pacienteId },
    });
    if (!paciente) {
      await this.auditar(
        TipoEventoAuditoria.SOLICITACAO_VINCULO,
        medicoId,
        pacienteId,
        StatusAuditoria.FAILURE,
        request,
      );
      throw new NotFoundException('Paciente não encontrado.');
    }

    const existente = await this.repo.findOne({
      where: { medicoId, pacienteId },
    });

    if (
      existente &&
      (existente.status === StatusVinculo.PENDENTE ||
        existente.status === StatusVinculo.APROVADO)
    ) {
      await this.auditar(
        TipoEventoAuditoria.SOLICITACAO_VINCULO,
        medicoId,
        pacienteId,
        StatusAuditoria.FAILURE,
        request,
      );
      throw new ConflictException(
        existente.status === StatusVinculo.APROVADO
          ? 'Já existe vínculo ativo com este paciente.'
          : 'Já existe solicitação pendente para este paciente.',
      );
    }

    if (
      existente &&
      existente.status === StatusVinculo.REJEITADO &&
      existente.respondidoEm
    ) {
      const decorridoMs =
        Date.now() - new Date(existente.respondidoEm).getTime();
      if (decorridoMs < COOLDOWN_APOS_REJEICAO_MS) {
        await this.auditar(
          TipoEventoAuditoria.SOLICITACAO_VINCULO,
          medicoId,
          pacienteId,
          StatusAuditoria.FAILURE,
          request,
        );
        throw new ForbiddenException(
          'O paciente rejeitou uma solicitação recente. Tente novamente em algumas horas.',
        );
      }
    }

    const agora = new Date();
    try {
      if (existente) {
        await this.repo.update(
          { medicoId, pacienteId },
          {
            status: StatusVinculo.PENDENTE,
            solicitadoPor: medicoId,
            solicitadoEm: agora,
            respondidoEm: null,
            termoVersao: null,
          },
        );
      } else {
        await this.repo.insert({
          medicoId,
          pacienteId,
          status: StatusVinculo.PENDENTE,
          solicitadoPor: medicoId,
          solicitadoEm: agora,
        });
      }
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err as QueryFailedError & { code?: string }).code ===
          POSTGRES_UNIQUE_VIOLATION
      ) {
        throw new ConflictException(
          'Já existe solicitação para este paciente.',
        );
      }
      throw err;
    }

    await this.auditar(
      TipoEventoAuditoria.SOLICITACAO_VINCULO,
      medicoId,
      pacienteId,
      StatusAuditoria.SUCCESS,
      request,
    );
  }

  async desvincular(
    medicoId: string,
    pacienteId: string,
    request: Request,
  ): Promise<void> {
    const vinculo = await this.repo.findOne({
      where: { medicoId, pacienteId },
    });
    if (!vinculo) {
      throw new NotFoundException('Vínculo não encontrado.');
    }

    if (vinculo.status === StatusVinculo.PENDENTE) {
      await this.repo.delete({ medicoId, pacienteId });
    } else if (vinculo.status === StatusVinculo.APROVADO) {
      const result = await this.repo.update(
        { medicoId, pacienteId, status: StatusVinculo.APROVADO },
        { status: StatusVinculo.REVOGADO, respondidoEm: new Date() },
      );
      if (!result.affected) {
        throw new ConflictException('Estado do vínculo mudou. Recarregue.');
      }
    } else {
      throw new NotFoundException('Vínculo não encontrado.');
    }

    await this.auditar(
      TipoEventoAuditoria.DESVINCULO_MEDICO_PACIENTE,
      medicoId,
      pacienteId,
      StatusAuditoria.SUCCESS,
      request,
    );
  }

  async aprovarSolicitacao(
    pacienteId: string,
    medicoId: string,
    request: Request,
  ): Promise<void> {
    const result = await this.repo.update(
      { medicoId, pacienteId, status: StatusVinculo.PENDENTE },
      {
        status: StatusVinculo.APROVADO,
        respondidoEm: new Date(),
        vinculadoEm: new Date(),
        termoVersao: TERMO_CONSENTIMENTO_VERSAO,
      },
    );

    if (!result.affected) {
      await this.auditar(
        TipoEventoAuditoria.APROVACAO_VINCULO,
        pacienteId,
        medicoId,
        StatusAuditoria.FAILURE,
        request,
      );
      throw new NotFoundException('Solicitação pendente não encontrada.');
    }

    await this.auditar(
      TipoEventoAuditoria.APROVACAO_VINCULO,
      pacienteId,
      medicoId,
      StatusAuditoria.SUCCESS,
      request,
    );
  }

  async rejeitarSolicitacao(
    pacienteId: string,
    medicoId: string,
    request: Request,
  ): Promise<void> {
    const result = await this.repo.update(
      { medicoId, pacienteId, status: StatusVinculo.PENDENTE },
      { status: StatusVinculo.REJEITADO, respondidoEm: new Date() },
    );

    if (!result.affected) {
      await this.auditar(
        TipoEventoAuditoria.REJEICAO_VINCULO,
        pacienteId,
        medicoId,
        StatusAuditoria.FAILURE,
        request,
      );
      throw new NotFoundException('Solicitação pendente não encontrada.');
    }

    await this.auditar(
      TipoEventoAuditoria.REJEICAO_VINCULO,
      pacienteId,
      medicoId,
      StatusAuditoria.SUCCESS,
      request,
    );
  }

  async revogarAcesso(
    pacienteId: string,
    medicoId: string,
    request: Request,
  ): Promise<void> {
    const result = await this.repo.update(
      { medicoId, pacienteId, status: StatusVinculo.APROVADO },
      { status: StatusVinculo.REVOGADO, respondidoEm: new Date() },
    );

    if (!result.affected) {
      await this.auditar(
        TipoEventoAuditoria.REVOGACAO_VINCULO,
        pacienteId,
        medicoId,
        StatusAuditoria.FAILURE,
        request,
      );
      throw new NotFoundException('Vínculo ativo não encontrado.');
    }

    await this.auditar(
      TipoEventoAuditoria.REVOGACAO_VINCULO,
      pacienteId,
      medicoId,
      StatusAuditoria.SUCCESS,
      request,
    );
  }

  async meusPacientes(medicoId: string) {
    const vinculos = await this.repo.find({
      where: { medicoId, status: StatusVinculo.APROVADO },
      relations: { paciente: { user: true } },
    });

    return vinculos.map((v) => ({
      pacienteId: v.pacienteId,
      nome: v.paciente.user.name,
      vinculadoEm: v.vinculadoEm,
      dataNascimento: v.paciente.dataNascimento,
      cpf: v.paciente.cpf,
      email: v.paciente.user.email,
    }));
  }

  async meusMedicos(pacienteId: string) {
    const vinculos = await this.repo.find({
      where: { pacienteId, status: StatusVinculo.APROVADO },
      relations: { medico: { user: true, especialidades: true } },
    });

    return vinculos.map((v) => {
      const especialidades = (v.medico.especialidades ?? [])
        .filter((esp) => esp.ativa)
        .map((esp) => ({ id: esp.id, nome: esp.nome }));

      const especialidadeConcatenada =
        especialidades.map((e) => e.nome).join(', ') ||
        v.medico.especialidadeLegado ||
        'A definir';

      return {
        medicoId: v.medicoId,
        nome: v.medico.user.name,
        especialidade: especialidadeConcatenada,
        especialidades,
        vinculadoEm: v.vinculadoEm,
      };
    });
  }

  async pacientesDisponiveis(medicoId: string) {
    const query = this.pacienteRepo
      .createQueryBuilder('paciente')
      .leftJoinAndSelect('paciente.user', 'user')
      .where(
        `paciente.userId NOT IN (
          SELECT "pacienteId" FROM medico_paciente
          WHERE "medicoId" = :medicoId
            AND "status" IN ('PENDENTE', 'APROVADO')
        )`,
        { medicoId },
      );

    const pacientes = await query.getMany();

    return pacientes.map((p) => ({
      id: p.userId,
      nome: p.user.name,
      dataNascimento: p.dataNascimento,
      email: p.user.email,
    }));
  }

  async solicitacoesPendentesParaPaciente(pacienteId: string) {
    const vinculos = await this.repo.find({
      where: { pacienteId, status: StatusVinculo.PENDENTE },
      relations: { medico: { user: true, especialidades: true } },
      order: { solicitadoEm: 'DESC' },
    });

    return vinculos.map((v) => {
      const especialidades = (v.medico.especialidades ?? [])
        .filter((esp) => esp.ativa)
        .map((esp) => ({ id: esp.id, nome: esp.nome }));
      return {
        medicoId: v.medicoId,
        medicoNome: v.medico.user.name,
        especialidades,
        solicitadoEm: v.solicitadoEm,
      };
    });
  }

  async solicitacoesEnviadasPorMedico(medicoId: string) {
    const vinculos = await this.repo.find({
      where: [
        { medicoId, status: StatusVinculo.PENDENTE },
        { medicoId, status: StatusVinculo.REJEITADO },
      ],
      relations: { paciente: { user: true } },
      order: { solicitadoEm: 'DESC' },
    });

    return vinculos.map((v) => ({
      pacienteId: v.pacienteId,
      pacienteNome: v.paciente.user.name,
      status: v.status,
      solicitadoEm: v.solicitadoEm,
      respondidoEm: v.respondidoEm,
    }));
  }

  private async auditar(
    evento: TipoEventoAuditoria,
    userId: string,
    recursoId: string,
    status: StatusAuditoria,
    request: Request,
  ) {
    await this.auditLogService.registrar(
      evento,
      userId,
      recursoId,
      status,
      request,
    );
  }
}
