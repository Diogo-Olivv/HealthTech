# Frontend

## Next.js 16 + React 19 + TypeScript

**O que é**

Next.js é um framework React para aplicações web. Adiciona roteamento baseado em arquivos, renderização no servidor (SSR), geração estática (SSG) e um servidor HTTP integrado. O projeto usa o **App Router** e Next.js 16 com React 19.

**Como funciona no projeto**

Cada pasta em `src/app/` é uma rota. `page.tsx` é a página; `layout.tsx` é o layout compartilhado. Componentes marcados com `"use client"` rodam no navegador; os demais rodam no servidor (Server Components).

```
src/app/login/page.tsx              → /login
src/app/dashboard/medico/page.tsx   → /dashboard/medico
```

Rotas de API do próprio Next (`src/app/api/...`) rodam no servidor Node do Next e são usadas como **proxy autenticado** para o backend NestJS, injetando o cookie httpOnly em `Authorization`.

**Por que foi escolhido**

- Padrão consolidado para React em produção.
- Deploy simples no Cloud Run.
- App Router facilita separar Server Components de Client Components.
- Route handlers permitem esconder o token JWT do JavaScript do cliente.

---

## CSS Modules + Tailwind CSS 4

**CSS Modules**

Cada componente tem seu próprio `.module.css`, com classes escopadas automaticamente pelo Next. Sem colisão de nomes entre componentes.

```tsx
import styles from "./Navbar.module.css";
<button className={styles.button}>Cadastrar</button>;
```

**Tailwind CSS 4**

Utilities disponíveis globalmente via `@tailwindcss/postcss` para responsividade e layout. Usado pontualmente em `layout.tsx` raiz e para composições rápidas onde a repetição não justifica um módulo.

**Por que**

- CSS Modules elimina conflitos e casa bem com CSS Modules dedicados a componentes complexos (ex.: `AuthLayout`, `MedicosTable`).
- Tailwind acelera prototipagem sem exigir arquivo dedicado para cada ajuste.

---

## Estado e composição

- **AuthContext** (`src/contexts/AuthContext.tsx`) guarda o usuário autenticado em memória.
- **AuthGuard** (`src/components/auth/AuthGuard.tsx`) protege rotas do `dashboard` por tipo (`MEDICO`, `PACIENTE`, `ADMIN`).
- **`useFetchData`** (`src/hooks/useFetchData.ts`) padroniza `{ data, loading, error, refetch }` para leituras.
- **Hooks por feature** (`useMeusPacientes`, `useArquivos`, `usePendingRequests`, `useSolicitacoesEnviadas`, `useProntuarioPaciente`, `useMeusMedicos`) compõem `useFetchData` com regras do domínio.

---

## SweetAlert2

Usado para confirmações e feedback modal. Integrado via wrapper (`utils/alerts.ts`) para manter API consistente. Componentes UI mais leves (`FeedbackMessage`, `ConfirmDialog`) cobrem casos que não precisam de modal.

---

## Referências

- [Documentação Next.js](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app/building-your-application/routing)
- [CSS Modules no Next](https://nextjs.org/docs/app/building-your-application/styling/css-modules)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SweetAlert2](https://sweetalert2.github.io/)
