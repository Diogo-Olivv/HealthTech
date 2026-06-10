import type { CreateUserDto } from "./create-user.dto";

export type CreatePacienteDto = CreateUserDto & {
  cpf: string;
  dataNascimento: string;
};
