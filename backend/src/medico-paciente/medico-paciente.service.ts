import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoPaciente } from '../entities/medico-paciente.entity';
import { Medico } from '../entities/medico.entity';
import { Paciente } from '../entities/paciente.entity';

@Injectable()
export class MedicoPacienteService {
  constructor(
    @InjectRepository(MedicoPaciente)
    private readonly repo: Repository<MedicoPaciente>,
    @InjectRepository(Paciente)
    private readonly pacienteRepo: Repository<Paciente>,
    @InjectRepository(Medico)
    private readonly medicoRepo: Repository<Medico>,
  ) {}

  async vincular(medicoId: string, pacienteId: string): Promise<void> {
    const paciente = await this.pacienteRepo.findOne({ where: { userId: pacienteId } });
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    const existente = await this.repo.findOne({ where: { medicoId, pacienteId } });
    if (existente) {
      throw new ConflictException('Vínculo já existe entre este médico e paciente.');
    }

    await this.repo.save(this.repo.create({ medicoId, pacienteId }));
  }

  async desvincular(medicoId: string, pacienteId: string): Promise<void> {
    const vinculo = await this.repo.findOne({ where: { medicoId, pacienteId } });
    if (!vinculo) {
      throw new NotFoundException('Vínculo não encontrado.');
    }
    await this.repo.remove(vinculo);
  }

  async meusPacientes(medicoId: string) {
    const vinculos = await this.repo.find({
      where: { medicoId },
      relations: { paciente: { user: true } },
    });

    return vinculos.map((v) => ({
      pacienteId: v.pacienteId,
      nome: v.paciente.user.name,
      vinculadoEm: v.vinculadoEm,
      dataNascimento: v.paciente.dataNascimento,
    }));
  }

  async meusMedicos(pacienteId: string) {
    const vinculos = await this.repo.find({
      where: { pacienteId },
      relations: { medico: { user: true } },
    });

    return vinculos.map((v) => ({
      medicoId: v.medicoId,
      nome: v.medico.user.name,
      especialidade: v.medico.especialidade,
      vinculadoEm: v.vinculadoEm,
    }));
  }

  // funcionalidade de listar todos os Pacientes disponíveis para vínculo, não mostrando os já vinculados com o médico
  async pacientesDisponiveis(medicoId: string) {
    // 1. Cria uma consulta no banco de dados na tabela de pacientes
    const query = this.pacienteRepo.createQueryBuilder('paciente')
      .leftJoinAndSelect('paciente.user', 'user') // Junta com os dados de Usuário para pegar o nome
      // 2. A Mágica: Exclui todos os pacientes que já têm o seu medicoId na tabela de vínculos
      
      .where(`paciente.userId NOT IN (
        SELECT "pacienteId" FROM medico_paciente WHERE "medicoId" = :medicoId
      )`, { medicoId });
    
    const pacientes = await query.getMany();
    
    // 3. Devolve só as informações limpas que o Frontend precisa
    return pacientes.map(p => ({
      id: p.userId,
      nome: p.user.name,
      cpf: p.cpf,
      email: p.user.email
    }));
  }


}
