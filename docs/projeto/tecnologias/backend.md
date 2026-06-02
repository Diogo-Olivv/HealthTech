# Backend

## NestJS + TypeScript

**O que é:**
NestJS é um framework para construção de APIs em Node.js, inspirado na arquitetura do Angular. Ele organiza o código em **módulos**, **controllers** e **services**, forçando uma separação clara de responsabilidades.

**Como funciona:**

- **Module:** declara o que existe em um domínio (ex: `UsersModule` registra o controller e o service de usuários)
- **Controller:** recebe as requisições HTTP e delega para o service. Não contém regras de negócio
- **Service:** contém toda a lógica de negócio (validações, transformações, persistência)
- **DTO + ValidationPipe:** valida automaticamente os dados que chegam na requisição antes de chegarem ao controller

```
Requisição HTTP
    1. Controller (recebe, delega)
    2. Service (processa, persiste)
    3. Resposta
```

**Por que foi escolhido:**

- Arquitetura requisitada, o documento de padrão do projeto definiu esse fluxo, as tecnologias foram escolhidas de acordo.
- Suporte nativo a TypeScript
- Integração fácil com TypeORM, JWT, class-validator
- Muito usado em projetos corporativos brasileiros e internacionais
- Documentação de alta qualidade

---

## TypeORM

**O que é:**
TypeORM é um ORM (Object-Relational Mapper) para TypeScript. Ele permite trabalhar com o banco de dados usando classes TypeScript (chamadas de **entities** ou **models** em outras arquiteturas) em vez de escrever SQL diretamente.

**Como funciona:**

Você define uma entity com decorators:

```typescript
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;
}
```

E o TypeORM traduz isso para SQL:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL
);
```

O modo `synchronize: true` (usado apenas em desenvolvimento) cria e atualiza as tabelas automaticamente. Em produção, usa-se **migrations**, arquivos versionados que descrevem mudanças no banco de forma controlada.

**Por que foi escolhido:**

- Integração nativa com NestJS
- Suporte excelente a TypeScript
- Compatível com PostgreSQL, MySQL, SQLite e outros
- Abstrai diferenças entre banco local (Docker) e produção (Cloud SQL) sem mudanças no código

---

## Referências

### NestJS

- [Documentação oficial - NestJS](https://docs.nestjs.com/)
- [Controllers - NestJS](https://docs.nestjs.com/controllers)
- [Providers/Services - NestJS](https://docs.nestjs.com/providers)
- [Validation - NestJS](https://docs.nestjs.com/techniques/validation)

### TypeORM

- [Documentação oficial - TypeORM](https://typeorm.io/)
- [Entities - TypeORM](https://typeorm.io/entities)
- [Migrations - TypeORM](https://typeorm.io/migrations)
