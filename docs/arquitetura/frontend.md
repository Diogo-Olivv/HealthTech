# Arquitetura Frontend

## Estrutura de Pastas

O frontend usa Next.js 16 com App Router. Cada pasta em `src/app/` é uma rota; `page.tsx` é a página.

```
frontend/src/
├── app/
│   ├── layout.tsx                    → root layout (metadata, viewport, theme)
│   ├── globals.css
│   ├── page.tsx                      → home, redireciona para /login
│   ├── login/                        → autenticação (público)
│   ├── register/                     → seleção do tipo + formulários (público)
│   │   ├── page.tsx                  → seleção paciente/médico
│   │   ├── paciente/page.tsx
│   │   └── medico/page.tsx
│   ├── dashboard/                    → área autenticada, protegida por AuthGuard
│   │   ├── layout.tsx                → shell com Navbar, checagem de sessão
│   │   ├── medico/
│   │   │   ├── page.tsx              → painel de resumo
│   │   │   ├── arquivos/page.tsx
│   │   │   ├── arquivos/upload/page.tsx
│   │   │   ├── paciente/[id]/page.tsx → prontuário
│   │   │   └── solicitacoes/page.tsx
│   │   └── paciente/
│   │       ├── page.tsx              → painel de resumo
│   │       ├── medicos/page.tsx      → SSR wrapper
│   │       ├── medicos/MeusMedicosClient.tsx
│   │       └── solicitacoes/page.tsx
│   └── api/                          → route handlers do Next.js
│       ├── auth/
│       │   ├── login/route.ts        → grava cookie httpOnly `accessToken`
│       │   ├── logout/route.ts
│       │   ├── register/paciente/route.ts
│       │   └── register/medico/route.ts
│       └── proxy/[...path]/route.ts  → proxy catch-all para o backend
├── components/
│   ├── ui/                           → Navbar, Button, ConfirmDialog, FeedbackMessage, ...
│   ├── arquivos/                     → FilesTable, ModalVinculo, VisualizadorArquivo
│   ├── especialidades/               → SeletorEspecialidades
│   ├── auth/AuthGuard.tsx
│   └── icons/                        → ícones SVG como componentes
├── contexts/AuthContext.tsx          → estado do usuário logado
├── hooks/
│   ├── useFetchData.ts               → hook genérico para leituras
│   ├── arquivos/                     → useArquivos, useProntuarioPaciente
│   ├── medicos/                      → useMeusMedicos, useMeusPacientes
│   └── solicitacoes/                 → usePendingRequests, useSolicitacoesEnviadas
├── services/
│   ├── users.service.ts
│   ├── arquivos.service.ts
│   └── especialidades.service.ts
├── lib/
│   ├── api-config.ts                 → API_INTERNAL_URL, API_URL, AUTH_COOKIE
│   ├── http.ts                       → helpers HTTP para o proxy
│   └── server-http.ts                → serverFetch para Server Components
├── dto/                              → espelhos dos DTOs do backend
├── types/                            → tipos utilitários
└── utils/                            → validação (CPF), formatação, alerts
```

---

## Proxy para o backend

O frontend nunca chama o backend diretamente do navegador. Toda chamada passa por um **route handler catch-all** em `app/api/proxy/[...path]/route.ts`:

```
Browser → GET /api/proxy/arquivos      (mesmo domínio, sem CORS)
      ↓
Route handler lê cookie httpOnly `accessToken`
      ↓
fetch(`${API_INTERNAL_URL}/arquivos`, Authorization: Bearer <token>)
      ↓
Backend NestJS na porta 3001 (dev) ou Cloud Run (prod)
```

Benefícios:

- **Token nunca chega ao JavaScript do cliente.** O cookie `accessToken` é `httpOnly`.
- **Sem CORS no navegador.** O proxy está no mesmo origin da aplicação.
- **URL interna diferente da URL pública.** `API_INTERNAL_URL` pode apontar para um endpoint privado (VPC) em produção; `API_URL` (`/api/proxy`) é o único caminho que o navegador enxerga.

O arquivo `lib/api-config.ts` centraliza os endpoints:

```typescript
export const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

export const API_URL = "/api/proxy";
export const AUTH_COOKIE = "accessToken";
```

---

## Autenticação

Fluxo de login:

1. Formulário `POST /api/auth/login` (route handler local).
2. O handler encaminha a requisição para `POST ${API_INTERNAL_URL}/users/login`.
3. Ao receber `{ accessToken, user }`, grava o token em cookie `httpOnly` e retorna somente o `user` ao cliente.
4. `AuthContext` guarda o `user` em memória e o expõe para páginas cliente.

Fluxo de logout: `POST /api/auth/logout` remove o cookie.

Proteção de rota: `AuthGuard` (no `dashboard/layout.tsx`) checa se há sessão válida e se o `tipo` do usuário casa com a rota (`/dashboard/medico/*` exige `MEDICO`; `/dashboard/paciente/*` exige `PACIENTE`).

---

## Camadas de dados

O padrão é sempre `page → hook → service → proxy → backend`.

**Service** (`src/services/*.service.ts`)

```typescript
// arquivos.service.ts (simplificado)
export async function listarArquivos(): Promise<ArquivoResponseDto[]> {
  const res = await fetch(`${API_URL}/arquivos`, { credentials: "include" });
  if (!res.ok) return throwFromResponse(res, "Não foi possível listar arquivos.");
  return res.json();
}
```

**Hook genérico** (`useFetchData`) encapsula estado `{ data, loading, error, refetch }`:

```typescript
const { data: pacientes, loading, error, refetch } = useFetchData(getMeusPacientes);
```

**Hooks específicos por feature** compõem o `useFetchData` com regras do domínio, por exemplo `useMeusPacientes`, `useMeusMedicos`, `useArquivos`, `useProntuarioPaciente`, `usePendingRequests`, `useSolicitacoesEnviadas`.

Server Components usam `lib/server-http.ts` (`serverFetch`) para as leituras iniciais e passam os dados prontos ao componente cliente (padrão SSR + client wrapper, ex.: `medicos/MeusMedicosClient.tsx`).

---

## Estilização

Cada componente tem seu próprio `.module.css` com escopo local:

```tsx
import styles from "./Navbar.module.css";

<button className={styles.button}>Enviar</button>;
```

Tailwind CSS 4 fica disponível globalmente via `postcss` para utilities de layout e responsividade. A `AuthLayout` e o `AuthCard` já cobrem os fluxos de auth com CSS Modules; utilities Tailwind são usadas pontualmente no `layout.tsx` raiz.

As variáveis globais de cor, tipografia e espaçamento vivem em `globals.css` e seguem a [Identidade Visual](../projeto/identidade_visual.md).

---

## Componentes reutilizáveis

- `Navbar`, `AuthLayout`, `AuthCard`, `Button`, `Input`, `PasswordField`, `RegisterTypeTabs`, `CloseButton`.
- `ConfirmDialog` substitui o `window.confirm` nativo; `FeedbackMessage` substitui o `alert`.
- Ícones em `components/icons/` são SVGs tipados em React.

---

## Testes

- Jest + React Testing Library cobrem componentes críticos (`FilesTable`, `SeletorEspecialidades`, `Button`).
- `@testing-library/user-event` é preferido a `fireEvent` para simular interações realistas.
