import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserType } from '../entities/user.entity';
import { Paciente } from '../entities/paciente.entity';
import { Medico } from '../entities/medico.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  tipo: UserType;
};

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
  ) { }

  async create(dto: CreateUserDto): Promise<PublicUser> {
    const emailExists = await this.usersRepository.findOneBy({
      email: dto.email,
    });
    if (emailExists) {
      throw new ConflictException('E-mail já está em uso');
    }

    if (dto.tipo === UserType.PACIENTE) {
      if (!dto.paciente) {
        throw new BadRequestException('Dados do paciente são obrigatórios');
      }
      const cpfExists = await this.pacientesRepository.findOneBy({
        cpf: dto.paciente.cpf,
      });
      if (cpfExists) {
        throw new ConflictException('CPF já cadastrado');
      }
    } else if (dto.tipo === UserType.MEDICO) {
      if (!dto.medico) {
        throw new BadRequestException('Dados do médico são obrigatórios');
      }
      const crmExists = await this.medicosRepository.findOneBy({
        crm: dto.medico.crm,
      });
      if (crmExists) {
        throw new ConflictException('CRM já cadastrado');
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const saved = await this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, {
        name: dto.name,
        email: dto.email,
        passwordHash,
        tipo: dto.tipo,
      });
      const savedUser = await manager.save(user);

      if (dto.tipo === UserType.PACIENTE && dto.paciente) {
        const paciente = manager.create(Paciente, {
          userId: savedUser.id,
          cpf: dto.paciente.cpf,
          dataNascimento: dto.paciente.dataNascimento,
        });
        await manager.save(paciente);
      } else if (dto.tipo === UserType.MEDICO && dto.medico) {
        const medico = manager.create(Medico, {
          userId: savedUser.id,
          crm: dto.medico.crm,
          especialidade: dto.medico.especialidade,
        });
        await manager.save(medico);
      }

      return savedUser;
    });

    return {
      id: saved.id,
      email: saved.email,
      name: saved.name,
      tipo: saved.tipo,
    };
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
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tipo: user.tipo,
      },
    };
  }

  async findById(id: string): Promise<PublicUser> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return { id: user.id, email: user.email, name: user.name, tipo: user.tipo };
  }
}
