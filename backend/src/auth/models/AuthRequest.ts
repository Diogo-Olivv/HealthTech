import { Request } from 'express';
import { PublicUser } from '../../users/dto/public-user.dto';
import { UserType } from '../../entities/user.entity';

export interface AuthRequest extends Request {
  user: PublicUser & { tipo: UserType };
}
