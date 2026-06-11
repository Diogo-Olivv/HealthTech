import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DataSource, EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserType } from '../entities/user.entity';
import { Paciente } from '../entities/paciente.entity';
import { Medico } from '../entities/medico.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PublicUser } from './dto/public-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Paciente)
    private readonly pacientesRepository: Repository<Paciente>,
    @InjectRepository(Medico)
    private readonly medicosRepository: Repository<Medico>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async createPaciente(dto: CreatePacienteDto): Promise<PublicUser> {
    await this.ensureEmailIsFree(dto.email);
    await this.ensureCpfIsFree(dto.cpf);

    return this.dataSource.transaction(async (manager) => {
      const user = await this.createBaseUser(manager, dto, UserType.PACIENTE);

      const paciente = manager.create(Paciente, {
        userId: user.id,
        cpf: dto.cpf,
        dataNascimento: dto.dataNascimento,
      });
      await manager.save(paciente);

      return this.toPublicUser(user);
    });
  }

  async createMedico(dto: CreateMedicoDto): Promise<PublicUser> {
    await this.ensureEmailIsFree(dto.email);
    await this.ensureCrmIsFree(dto.crm);

    return this.dataSource.transaction(async (manager) => {
      const user = await this.createBaseUser(manager, dto, UserType.MEDICO);

      const medico = manager.create(Medico, {
        userId: user.id,
        crm: dto.crm,
        especialidade: dto.especialidade,
      });
      await manager.save(medico);

      return this.toPublicUser(user);
    });
  }

  async login(
    dto: LoginUserDto,
  ): Promise<{ accessToken: string; user: PublicUser }> {
    const user = await this.usersRepository.findOneBy({ email: dto.email });
    const valid =
      user && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!user || !valid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email, tipo: user.tipo };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: this.toPublicUser(user),
    };
  }

  async findById(id: string): Promise<PublicUser> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return this.toPublicUser(user);
  }

  // --- HELPERS PRIVADOS ---

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      tipo: user.tipo,
    };
  }

  private async createBaseUser(
    manager: EntityManager,
    dto: CreateUserDto,
    tipo: UserType,
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = manager.create(User, {
      name: dto.name,
      email: dto.email,
      passwordHash,
      tipo,
    });
    return manager.save(user);
  }

  private async ensureEmailIsFree(email: string): Promise<void> {
    const exists = await this.usersRepository.findOneBy({ email });
    if (exists) {
      throw new ConflictException('E-mail já está em uso');
    }
  }

  private async ensureCpfIsFree(cpf: string): Promise<void> {
    const exists = await this.pacientesRepository.findOneBy({ cpf });
    if (exists) {
      throw new ConflictException('CPF já cadastrado');
    }
  }

  private async ensureCrmIsFree(crm: string): Promise<void> {
    const exists = await this.medicosRepository.findOneBy({ crm });
    if (exists) {
      throw new ConflictException('CRM já cadastrado');
    }
  }
}