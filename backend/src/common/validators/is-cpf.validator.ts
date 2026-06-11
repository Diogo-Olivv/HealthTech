import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function isValidCPF(value: string): boolean {
  const cpf = value.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcDigit = (length: number): number => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += Number(cpf[i]) * (length + 1 - i);
    }
    const result = (sum * 10) % 11;
    return result === 10 ? 0 : result;
  };

  return calcDigit(9) === Number(cpf[9]) && calcDigit(10) === Number(cpf[10]);
}

@ValidatorConstraint({ name: 'isCpf', async: false })
export class IsCpfConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && isValidCPF(value);
  }

  defaultMessage(): string {
    return 'CPF deve ser um CPF válido';
  }
}

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfConstraint,
    });
  };
}
