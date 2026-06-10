import type { CreateUserDto } from "./create-user.dto";

export type CreatePacienteDto = CreateUserDto & {
  cpf: string;
  // input type="date" entrega a data como "YYYY-MM-DD"
  dataNascimento: string;
};
