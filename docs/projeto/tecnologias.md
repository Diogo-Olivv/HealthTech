# Tecnologias Utilizadas

## Frontend

### Next.js + TypeScript

**O que é:**
Next.js é um framework React para construção de aplicações web. Ele adiciona sobre o React funcionalidades como roteamento baseado em arquivos, renderização no servidor (SSR) e geração estática (SSG), tornando o desenvolvimento mais estruturado e a aplicação mais performática.

**Como funciona no projeto:**
Utilizamos o **App Router** (introduzido no Next.js 13), onde cada pasta dentro de `src/app/` representa uma rota. O arquivo `page.tsx` dentro de uma pasta é automaticamente a página daquela rota:

```
src/app/register/page.tsx  →  http://localhost:3000/register
src/app/page.tsx           →  http://localhost:3000/
```

Os componentes marcados com `'use client'` rodam no navegador (podem usar hooks como `useState`). Sem essa diretiva, o componente roda no servidor por padrão.

**Por que foi escolhido:**

- Padrão consolidado no mercado para aplicações React em produção
- Integração nativa com TypeScript
- Deploy simplificado no Google Cloud Run ou Vercel
- Grande comunidade e documentação extensa
- Facilita a separação entre componentes de servidor e cliente

---

### Cascading Style Sheet (CSS)

**O que é:**
CSS é um arquivo de estilização, nesse projeto cada componente tem seu próprio arquivo `.module.css`. As classes são escopadas automaticamente, não há conflito de nomes entre componentes diferentes.

**Como funciona:**

```tsx
import styles from "./register.module.css";

// styles.button é único para este componente
<button className={styles.button}>Cadastrar</button>;
```

**Por que foi escolhido:**

- Sem configuração extra, padrão do Next.js
- Evita conflitos de CSS em projetos com múltiplos desenvolvedores
- Padrão Mundial

---

## Backend

### NestJS + TypeScript

**O que é:**
NestJS é um framework para construção de APIs em Node.js, inspirado na arquitetura do Angular. Ele organiza o código em **módulos**, **controllers** e **services**, forçando uma separação clara de responsabilidades.

**Como funciona:**

- **Module:** declara o que existe em um domínio (ex: `UsersModule` registra o controller e o service de usuários)
- **Controller:** recebe as requisições HTTP e delega para o service. Não contém regras de negócio
- **Service:** contém toda a lógica de negócio (validações, transformações, persistência)
- **DTO + ValidationPipe:** valida automaticamente os dados que chegam na requisição antes de chegarem ao controller

```
Requisição HTTP
    → Controller (recebe, delega)
    → Service (processa, persiste)
    → Resposta
```

**Por que foi escolhido:**

- Arquitetura requisitada, o documento de padrão do projeto definiu esse fluxo, as tecnologias foram escolhidas de acordo.
- Suporte nativo a TypeScript
- Integração fácil com TypeORM, JWT, class-validator
- Muito usado em projetos corporativos brasileiros e internacionais
- Documentação de alta qualidade

---

### TypeORM

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

## Banco de Dados

### PostgreSQL

**O que é:**
PostgreSQL é um sistema gerenciador de banco de dados relacional open-source, considerado um dos mais robustos e confiáveis disponíveis. Dados são organizados em tabelas com colunas tipadas, relacionamentos e restrições de integridade.

**Como funciona no projeto:**
O banco armazena as entidades do sistema (usuários, arquivos, logs de auditoria). O acesso é feito exclusivamente pelo backend via TypeORM, o frontend jamais acessa o banco diretamente.

**Por que foi escolhido:**

- Suportado nativamente pelo Google Cloud SQL
- Robusto para aplicações de saúde que exigem consistência de dados
- Recursos avançados: UUIDs nativos, JSONB, full-text search
- Amplamente usado no mercado e com grande documentação

---

### Docker (desenvolvimento local)

**O que é:**
Docker é uma plataforma de containers que permite empacotar aplicações e suas dependências em ambientes isolados e reproduzíveis.

**Como funciona no projeto:**
Em desenvolvimento, o PostgreSQL e o Adminer rodam em containers Docker definidos no `docker-compose.yml`. Qualquer membro do time executa `docker compose up -d` e tem o banco funcionando em segundos, independentemente do sistema operacional.

```yaml
services:
  postgres: # banco de dados
    image: postgres:16-alpine
    ports:
      - "5433:5432"

  adminer: # interface web para inspecionar o banco
    image: adminer
    ports:
      - "8080:8080"
```

**Por que foi escolhido:**

- Elimina o problema "funciona na minha máquina", todos rodam o mesmo ambiente
- Não exige instalação manual do PostgreSQL
- Fácil de resetar o banco durante o desenvolvimento (`docker compose down -v`)

---

### Google Cloud SQL (produção)

**O que é:**
Cloud SQL é o serviço gerenciado de banco de dados relacional do Google Cloud Platform. Ele oferece instâncias de PostgreSQL, MySQL e SQL Server com backups automáticos, alta disponibilidade e escalabilidade gerenciados pelo Google.

**Como funciona no projeto:**
Em produção, o Cloud Run se conecta ao Cloud SQL via **Unix socket**, um canal de comunicação direto e seguro dentro da infraestrutura Google, sem expor o banco à internet. A variável `INSTANCE_CONNECTION_NAME` (formato `PROJECT_ID:REGION:INSTANCE_NAME`) identifica qual instância usar.

**Por que foi escolhido:**

- Requisito do projeto (Google Cloud como plataforma de deploy)
- Gerenciamento automático de backups, patches e alta disponibilidade
- Integração nativa com Cloud Run, conexão segura sem configuração de rede complexa
- Custo reduzido para ambientes de desenvolvimento e staging

---

## Autenticação (A ser definido)

### JWT — JSON Web Tokens

**O que é:**
JWT é um padrão para transmissão segura de informações entre partes como um token assinado. Após o login, o servidor gera um token que o cliente envia em todas as requisições subsequentes para provar sua identidade.

**Biblioteca:** `@nestjs/jwt` + `passport-jwt`

---

### bcrypt

**O que é:**
bcrypt é um algoritmo de hashing especialmente projetado para senhas. Diferente de MD5 ou SHA, ele é intencionalmente lento e usa um "salt" aleatório — isso torna ataques de força bruta computacionalmente inviáveis.

**Como funciona no projeto:**

```typescript
// Cadastro: senha → hash armazenado no banco
const passwordHash = await bcrypt.hash(password, 10);

// Login: compara senha digitada com hash armazenado
const isValid = await bcrypt.compare(password, user.passwordHash);
```

**Por que foi escolhido:**

- Padrão da indústria para hashing de senhas
- Resistente a ataques de rainbow table (salt automático)
- Custo de processamento configurável (`10` = fator de trabalho padrão)

---

## Armazenamento de Arquivos

### Google Cloud Storage

**O que é:**
Cloud Storage é o serviço de armazenamento de objetos do Google Cloud. Permite guardar arquivos de qualquer tamanho (imagens, PDFs, exames) com alta durabilidade e disponibilidade.

**Como funcionará no projeto:**
Arquivos enviados pelos usuários (exames, documentos médicos) serão armazenados no GCS. O banco de dados armazenará apenas os **metadados** (nome, caminho, tipo, tamanho) não o arquivo em si.

**Biblioteca:** `@google-cloud/storage`

---

## Resumo da Stack

| Camada          | Tecnologia                    | Versão |
| --------------- | ----------------------------- | ------ |
| Frontend        | Next.js + TypeScript          | 16.x   |
| Estilização     | CSS Modules                   | —      |
| Backend         | NestJS + TypeScript           | 11.x   |
| ORM             | TypeORM                       | 1.x    |
| Banco (dev)     | PostgreSQL via Docker         | 16     |
| Banco (prod)    | Google Cloud SQL (PostgreSQL) | 16     |
| Autenticação    | JWT + bcrypt                  | —      |
| Storage         | Google Cloud Storage          | —      |
| Containerização | Docker + Docker Compose       | —      |
| Deploy          | Google Cloud Run              | —      |

---

## Referências

### Next.js

- [Documentação oficial — Next.js](https://nextjs.org/docs)
- [App Router — Next.js](https://nextjs.org/docs/app/building-your-application/routing)
- [CSS Modules — Next.js](https://nextjs.org/docs/app/building-your-application/styling/css-modules)

### NestJS

- [Documentação oficial — NestJS](https://docs.nestjs.com/)
- [Controllers — NestJS](https://docs.nestjs.com/controllers)
- [Providers/Services — NestJS](https://docs.nestjs.com/providers)
- [Validation — NestJS](https://docs.nestjs.com/techniques/validation)

### TypeORM

- [Documentação oficial — TypeORM](https://typeorm.io/)
- [Entities — TypeORM](https://typeorm.io/entities)
- [Migrations — TypeORM](https://typeorm.io/migrations)

### PostgreSQL

- [Documentação oficial — PostgreSQL](https://www.postgresql.org/docs/)
- [PostgreSQL no Docker Hub](https://hub.docker.com/_/postgres)

### Google Cloud

- [Cloud SQL — Documentação](https://cloud.google.com/sql/docs/postgres)
- [Cloud Run — Conectar ao Cloud SQL](https://cloud.google.com/sql/docs/postgres/connect-run)
- [Cloud Storage — Documentação](https://cloud.google.com/storage/docs)

### Autenticação

- [JWT — Introdução](https://jwt.io/introduction)
- [bcrypt — npm](https://www.npmjs.com/package/bcrypt)
- [Passport.js — Documentação](https://www.passportjs.org/)

### Docker

- [Docker — Documentação oficial](https://docs.docker.com/)
- [Docker Compose — Referência](https://docs.docker.com/compose/compose-file/)
- [Adminer — Site oficial](https://www.adminer.org/)
