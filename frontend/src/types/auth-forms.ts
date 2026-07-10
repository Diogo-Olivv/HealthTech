export interface LoginFormState {
    email: string;
    password: string;
}

export interface RegisterPacienteFormState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    cpf: string;
    dataNascimento: string;
}

export interface RegisterMedicoFormState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    crm: string;
    especialidadeIds: string[];
}
