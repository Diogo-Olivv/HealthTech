import type { UserType } from "./user-type.enum";

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  tipo: UserType;
};
