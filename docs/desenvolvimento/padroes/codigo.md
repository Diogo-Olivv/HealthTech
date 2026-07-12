# Padrões de Código

Regras práticas que valem tanto para backend quanto para frontend. O objetivo é reduzir surpresas em code review e manter o repositório coerente sem depender de um `CODEOWNERS` extenso.

## Regras gerais

- **TypeScript estrito.** Nada de `any` sem motivo registrado (comentário curto ou tipo específico do domínio).
- **ESLint + Prettier** já configurados. `npm run lint` corrige a maioria dos problemas de estilo.
- **Nomes em português para conceitos de domínio** (`paciente`, `vincular`, `arquivo`). Nomes técnicos de framework seguem o inglês do próprio framework (`controller`, `guard`, `service`).
- **Sem segredos no repositório.** Use `.env` localmente (gitignored) e Secret Manager em produção.
- **Sem `console.log` no código final.** Use o `Logger` do NestJS no backend e apagar debug prints antes do commit no frontend.
- **Sem `TODO` órfão.** Se o comentário `TODO` não aponta para uma issue, ele é dívida invisível. Ou vira issue, ou é resolvido no PR.

## Backend (NestJS)

### Camadas

Cada módulo segue a separação clássica: `controller` recebe HTTP, delega ao `service`; `service` concentra regra de negócio e usa `Repository` do TypeORM.

- **Controller** não conhece SQL, TypeORM ou banco. Só orquestra input, guards e response.
- **Service** não conhece `Request`, `Response` nem `Query`. Recebe dados já validados e retorna objetos.
- **DTO** com decorators `class-validator` e `class-transformer`. O `ValidationPipe` global está com `whitelist: true` e `forbidNonWhitelisted: true`, portanto payload com campo não declarado retorna `400`.

### Guards e roles

- Toda rota autenticada declara `@UseGuards(JwtAuthGuard)`.
- Toda rota restrita a perfil declara também `@UseGuards(RolesGuard)` e `@Roles(UserType.X, ...)`.
- Rotas de admin usam `@Roles(UserType.ADMIN)`.

### Auditoria

Rotas de negócio sensíveis (login, cadastro, upload, vínculo, etc.) usam o decorator `@Audit(...)`. O `AuditInterceptor` global registra `SUCCESS` no `tap` e `FAILURE` no `catchError`. Consulte [Arquitetura do Backend](../../arquitetura/backend.md) para o catálogo de eventos.

### Migrations

`synchronize` está desligado em todos os ambientes. Toda alteração em entidade exige migration commitada no mesmo PR. Veja [Setup Inicial](../setup.md) e o [ADR-0001](../adr/0001-migrations-via-cloud-run-job.md).

## Frontend (Next.js)

### App Router

Rotas de aplicação vivem em `frontend/src/app`. Cada pasta é uma rota; `page.tsx` é a página. Componentes que precisam de hooks começam com `"use client"`.

### Camadas

- **Página (`page.tsx`)** monta layout, seleciona hooks e delega ao componente cliente quando necessário. Não faz `fetch` direto.
- **Hook (`src/hooks/**/*.ts`)** encapsula estado, cache e chamadas ao service. Padrão único: `useFetchData` para leituras, hooks específicos por domínio (`useMeusPacientes`, `useArquivos`) para regras.
- **Service (`src/services/*.service.ts`)** faz o `fetch` HTTP. Nunca chama a API externa direto: usa o proxy `/api/proxy/[...path]`, que injeta o token httpOnly.
- **DTO (`src/dto/*.ts`)** espelha os DTOs do backend. Tipos de resposta ficam explícitos.

### Estilos

- CSS Modules por componente (`Componente.module.css`) para escopo local.
- Tailwind CSS 4 disponível globalmente para utilities de layout e responsividade.
- Cores, tipografia e espaçamento seguem a [Identidade Visual](../../projeto/identidade_visual.md).

### Autenticação

- Após login, o backend retorna JWT, e o frontend armazena via cookie httpOnly `accessToken` gerenciado nas rotas `route.ts` de `/api/auth/*`.
- Página cliente recupera o usuário via `AuthContext`.
- `AuthGuard` protege rotas por tipo de usuário.

## Testes

- Nenhum PR de feature ou fix entra sem teste correspondente. Bug fix acompanha teste de regressão.
- Backend: `Jest` + `@nestjs/testing` para unit, `Supertest` para E2E.
- Frontend: `Jest` + `React Testing Library` para componentes.
- Cobertura mínima esperada por camada está em [Testes Automatizados](../../projeto/tecnologias/testes.md).

## Convenções de arquivo

- Arquivos por camada usam o sufixo do papel: `*.controller.ts`, `*.service.ts`, `*.module.ts`, `*.entity.ts`, `*.dto.ts`.
- Componente React: `PascalCase` (`FeedbackMessage.tsx`, `AuthGuard.tsx`).
- Utilitário: `kebab-case` (`format-tamanho.ts`, `mensagem-de-erro.ts`).

## Regra de ouro do PR

- **Diff pequeno.** Um PR é um objeto de comunicação; se ele não cabe na cabeça do revisor, provavelmente também não cabia na sua.
- Se sua branch acumulou refactors não relacionados, quebre em PRs separados.
