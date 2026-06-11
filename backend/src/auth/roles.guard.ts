import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '../entities/user.entity';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesExigidas = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Rota sem @Roles() — qualquer usuário autenticado passa
    if (!rolesExigidas || rolesExigidas.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!rolesExigidas.includes(user?.tipo)) {
      throw new ForbiddenException('Acesso negado para este tipo de usuário');
    }

    return true;
  }
}