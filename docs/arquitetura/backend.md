# Backend

## Estrutura de módulos

O NestJS organiza o código em módulos. Cada funcionalidade do sistema (usuários, arquivos, autenticação) vive em seu próprio módulo com controller, service e eventualmente entidades próprias.

```
src/
├── entities/
│   └── user.entity.ts        # Mapeamento da tabela no banco
├── users/
│   ├── dto/                   # Segue Mesmo DTO do FrontEnd
│   │   └── create-user.dto.ts # Validação dos dados de entrada
│   ├── users.controller.ts    # Recebe e responde requisições HTTP
│   ├── users.service.ts       # Regras de negócio
│   └── users.module.ts        # Registra o módulo no NestJS
├── app.module.ts              # Módulo raiz, conecta tudo
└── main.ts                    # Ponto de entrada da aplicação
```

---

## Fluxo de uma requisição

```
POST /api/users/register
1. ValidationPipe              # Valida o body antes de chegar no controller
                               # (rejeita automaticamente se faltar campo ou formato errado)
2. UsersController             # Recebe a requisição, chama o service
3. UsersService                # Verifica se email existe, faz hash da senha, salva
4. Repository (Banco de Dados) # Executa o SQL no banco
5. Resposta JSON               # Retorna { id, email, name }, a senha nunca retorna
```

---

## Regras de segurança aplicadas

- **Senhas**: nunca armazenadas em texto puro, sempre com hash `bcrypt`.
- **Resposta**: o campo `passwordHash` **nunca** é retornado nas respostas da API.
- **Validação**: o `ValidationPipe` com `whitelist: true` remove automaticamente qualquer campo extra que o cliente envie.
- **Variáveis sensíveis**: credenciais ficam no `.env`, que está no `.gitignore`.

---

## Referências

- [Documentação NestJS - Modules](https://docs.nestjs.com/modules)
- [Documentação NestJS - Controllers](https://docs.nestjs.com/controllers)
- [Documentação NestJS - Providers/Services](https://docs.nestjs.com/providers)
- [Documentação NestJS - Validation (ValidationPipe)](https://docs.nestjs.com/techniques/validation)
- [Documentação TypeORM - Entities](https://typeorm.io/entities)
- [bcrypt - npm](https://www.npmjs.com/package/bcrypt)
