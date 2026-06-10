import type { CreateUserDto } from "./create-user.dto";

export type CreateMedicoDto = CreateUserDto & {
  crm: string;
  especialidade: string;
};
