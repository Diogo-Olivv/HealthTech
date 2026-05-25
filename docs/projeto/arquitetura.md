# Arquitetura do Projeto

## Visão Geral

O projeto é organizado como um **monorepo**: um único repositório Git contendo o frontend e o backend em pastas separadas. Essa escolha simplifica o desenvolvimento para times pequenos, não é necessário sincronizar dois repositórios diferentes para uma única mudança.

```
AILAB_Makers---Grupo-2/
├── backend/           -> API (NestJS)
├── frontend/          -> Interface web (Next.js)
├── docker-compose.yml -> Banco de Dados
├── LICENSE
└── README.md
```

---

## Arquitetura do Projeto

### Separação de responsabilidades

O sistema é dividido em três camadas independentes que se comunicam:

```
┌─────────────────────────────────────────────────────────────────┐
│  USUÁRIO (navegador)                                             │
│  Acessa http://localhost:3000                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP (fetch)
┌────────────────────────▼────────────────────────────────────────┐
│  FRONTEND — Next.js (porta 3000)                                 │
│  Responsável pela interface visual e experiência do usuário      │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP REST (JSON)
┌────────────────────────▼────────────────────────────────────────┐
│  BACKEND — NestJS (porta 3001)                                   │
│  Responsável pelas regras de negócio e segurança dos dados       │
└────────────────────────┬────────────────────────────────────────┘
                         │ TCP (PostgreSQL protocol)
┌────────────────────────▼────────────────────────────────────────┐
│  BANCO DE DADOS — PostgreSQL                                     │
│  Dev: Docker (porta 5433)  |  Prod: Google Cloud SQL             │
└─────────────────────────────────────────────────────────────────┘
```

O frontend **nunca** acessa o banco de dados diretamente. Toda operação passa pelo backend, que valida, processa e então persiste os dados.

---

## Fluxo Funcional do Frontend

### Estrutura de camadas

O frontend é organizado em três camadas com responsabilidades distintas:

```
src/
├── app/                  ← Páginas (rotas da aplicação)
│   └── register/
│       ├── register.module.css ← Estilização
│       └── page.tsx      ← Renderização + estado visual
├── services/             ← Comunicação com a API
│   └── users.service.ts  ← Chamadas HTTP ao backend
└── dto/                  ← Data Tranfer Object
    └── users.dto.ts      ← Formatos de request e response
```

**Regra fundamental:** cada camada conhece apenas a camada abaixo dela.

- A página chama o service. A página **não** faz `fetch` diretamente.
- O service chama a API. O service **não** gerencia estado visual.
- O DTO define os tipos. O DTO **não** tem lógica.

### Fluxo de um cadastro

```
1. Usuário preenche o formulário e clica em "Cadastrar"
        ↓
2. page.tsx chama registerUser(form)
        ↓
3. users.service.ts monta e envia o POST /api/users/register
        ↓
4. Backend processa e retorna { id, email, name }
        ↓
5. page.tsx atualiza o estado visual (success ou error)
        ↓
6. Usuário vê o feedback na tela
```

### Por que usar um service separado?

Sem o service, o `fetch` ficaria diretamente na página. O problema: se 3 páginas diferentes precisarem cadastrar um usuário, o código de chamada HTTP se repete 3 vezes. Com o service, a lógica de comunicação existe em **um único lugar**, se a URL da API mudar, você altera apenas `users.service.ts`.

---

## Backend

### Estrutura de módulos

O NestJS organiza o código em módulos. Cada funcionalidade do sistema (usuários, arquivos, autenticação) vive em seu próprio módulo com controller, service e eventualmente entidades próprias.

```
src/
├── entities/
│   └── user.entity.ts        ← Mapeamento da tabela no banco
├── users/
│   ├── dto/                   ← Segue Mesmo DTO do FrontEnd
│   │   └── create-user.dto.ts ← Validação dos dados de entrada
│   ├── users.controller.ts    ← Recebe e responde requisições HTTP
│   ├── users.service.ts       ← Regras de negócio
│   └── users.module.ts        ← Registra o módulo no NestJS
├── app.module.ts              ← Módulo raiz - conecta tudo
└── main.ts                    ← Ponto de entrada da aplicação
```

### Fluxo de uma requisição no backend

```
POST /api/users/register
        ↓
ValidationPipe           ← Valida o body antes de chegar no controller
        ↓                  (rejeita automaticamente se faltar campo ou formato errado)
UsersController          ← Recebe a requisição, chama o service
        ↓
UsersService             ← Verifica se email existe, faz hash da senha, salva
        ↓
Repository (Banco de Dados)     ← Executa o SQL no banco
        ↓
Resposta JSON            ← Retorna { id, email, name } --> senha nunca retorna
```

### Regras de segurança aplicadas

- **Senhas**: nunca armazenadas em texto puro --> sempre com hash `bcrypt`.
- **Resposta**: o campo `passwordHash` **nunca** é retornado nas respostas da API
- **Validação**: o `ValidationPipe` com `whitelist: true` remove automaticamente qualquer campo extra que o cliente envie
- **Variáveis sensíveis**: credenciais ficam no `.env`, que está no `.gitignore`

### Rota disponível

| Método | Rota                | Descrição           | Auth |
| ------ | ------------------- | ------------------- | ---- |
| POST   | /api/users/register | Cadastro de usuário | Não  |

---

## Banco de Dados

### Entidade User

```
Tabela: users
┌──────────────┬──────────────────────┬───────────────────────────────┐
│ Coluna       │ Tipo                 │ Descrição                     │
├──────────────┼──────────────────────┼───────────────────────────────┤
│ id           │ UUID (PK)            │ Identificador único           │
│ email        │ VARCHAR (UNIQUE)     │ E-mail do usuário             │
│ passwordHash │ VARCHAR              │ Senha com bcrypt              │
│ name         │ VARCHAR              │ Nome do usuário               │
│ createdAt    │ TIMESTAMP            │ Data de criação (automático)  │
└──────────────┴──────────────────────┴───────────────────────────────┘
```

### Desenvolvimento: Docker

Em desenvolvimento, o banco de dados roda em um container Docker gerenciado pelo `docker-compose.yml`. Isso significa que qualquer membro do time pode rodar o projeto no notebook **sem** precisar instalar o PostgreSQL manualmente ou ter acesso ao Google Cloud.

```yaml
# docker-compose.yml
postgres:
  image: postgres:16-alpine
  ports:
    - '5433:5432'   ← host:container
```

O TypeORM (Bilioteca para Banco de Dados) com `synchronize: true` cria e atualiza as tabelas automaticamente a cada vez que o backend inicia. Isso elimina a necessidade de rodar scripts SQL manualmente durante o desenvolvimento.

> **Atenção:** `synchronize: true` está **desabilitado em produção** (`NODE_ENV=production`). Em produção, mudanças no banco são feitas via migrations, isso protege os dados de alterações acidentais.

### Produção: Google Cloud SQL

Em produção (Cloud Run), o banco é uma instância gerenciada de PostgreSQL no **Google Cloud SQL**. A conexão não usa `host:port` como em desenvolvimento, o Google injeta automaticamente um **Unix socket** no container do Cloud Run.

```
Desenvolvimento:  localhost:5433  →  container Docker
Produção:         /cloudsql/PROJECT:REGION:INSTANCE  →  Cloud SQL
```

O código detecta o ambiente pela variável `INSTANCE_CONNECTION_NAME`:

```typescript
// Se INSTANCE_CONNECTION_NAME estiver preenchida → Cloud SQL (socket)
// Se estiver vazia → PostgreSQL local (TCP)
const instanceName = config.get('INSTANCE_CONNECTION_NAME');

...(instanceName
  ? { host: `/cloudsql/${instanceName}` }
  : { host: 'localhost', port: 5433 })
```

Isso garante que o **mesmo código** funciona em desenvolvimento e produção, apenas com variáveis de ambiente diferentes.

### Adminer: Visualizador do banco em desenvolvimento

Para inspecionar o banco durante o desenvolvimento sem instalar ferramentas externas, o `docker-compose.yml` inclui o **Adminer**, uma interface web de gerenciamento de banco de dados.

Após `docker compose up -d`, acesse `http://localhost:8080` com:

- **Sistema:** PostgreSQL
- **Servidor:** `postgres`
- **Usuário:** `postgres`
- **Senha:** `postgres`
- **Base de dados:** `healthtech`

---

## Referências

- [Documentação NestJS — Modules](https://docs.nestjs.com/modules)
- [Documentação NestJS — Controllers](https://docs.nestjs.com/controllers)
- [Documentação NestJS — Providers/Services](https://docs.nestjs.com/providers)
- [Documentação NestJS — Validation (ValidationPipe)](https://docs.nestjs.com/techniques/validation)
- [Documentação TypeORM — Entities](https://typeorm.io/entities)
- [Documentação TypeORM — Data Source (synchronize)](https://typeorm.io/data-source-options)
- [Documentação Next.js — App Router](https://nextjs.org/docs/app)
- [Google Cloud SQL — Connecting from Cloud Run](https://cloud.google.com/sql/docs/postgres/connect-run)
- [Google Cloud Run — Overview](https://cloud.google.com/run/docs/overview/what-is-cloud-run)
- [bcrypt — npm](https://www.npmjs.com/package/bcrypt)
- [Adminer — Documentação oficial](https://www.adminer.org/)
