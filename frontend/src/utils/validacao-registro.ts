const NOME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

export function validarNomeCompleto(nome: string): string | null {
  const nomeTrim = nome.trim();
  if (nomeTrim.length === 0) return "Informe o nome completo.";
  if (nomeTrim.length < 2) return "O nome deve ter pelo menos 2 caracteres.";
  if (!NOME_REGEX.test(nomeTrim)) {
    return "O nome deve conter apenas letras.";
  }
  return null;
}

export function validarEmail(email: string): string | null {
  const emailTrim = email.trim();
  if (emailTrim.length === 0) return "Informe o e-mail.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
    return "E-mail inválido.";
  }
  return null;
}

export function validarSenha(senha: string): string | null {
  if (senha.length === 0) return "Informe a senha.";
  if (senha.length < 8) return "A senha deve ter pelo menos 8 caracteres.";
  return null;
}

export function validarConfirmacaoSenha(
  senha: string,
  confirmacao: string,
): string | null {
  if (confirmacao.length === 0) return "Confirme a senha.";
  if (senha !== confirmacao) return "As senhas não coincidem.";
  return null;
}

export function calcularIdadeEmAnos(dataNascimento: string): number {
  const nasc = new Date(dataNascimento);
  if (Number.isNaN(nasc.getTime())) return NaN;
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade -= 1;
  return idade;
}

export function validarDataNascimento(data: string): string | null {
  if (!data) return "Informe a data de nascimento.";
  const idade = calcularIdadeEmAnos(data);
  if (Number.isNaN(idade)) return "Data de nascimento inválida.";
  if (idade <= 0 || idade > 130) return "Data de nascimento inválida.";
  return null;
}

export function validarCrm(crm: string): string | null {
  if (crm.trim().length === 0) return "Informe o CRM.";
  return null;
}

export function validarEspecialidades(ids: string[]): string | null {
  if (ids.length === 0) return "Selecione ao menos uma especialidade.";
  return null;
}
