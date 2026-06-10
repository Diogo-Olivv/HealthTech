import { UserType } from '../../entities/user.entity';

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  tipo: UserType;
};