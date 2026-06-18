# Arquitetura Frontend

## Estrutura de Pastas

```
frontend/
└── src/
    └── app/
        ├── page.tsx                    → rota /  (home / login)
        ├── register/
        │   ├── paciente/page.tsx       → rota /register/paciente
        │   └── medico/page.tsx         → rota /register/medico
        ├── paciente/
        │   ├── page.tsx                → rota /paciente  (área do paciente)
        │   └── arquivos/page.tsx       → rota /paciente/arquivos
        └── medico/
            ├── page.tsx                → rota /medico  (área do médico)
            └── arquivos/
                ├── page.tsx            → rota /medico/arquivos
                └── upload/page.tsx     → rota /medico/arquivos/upload
```

Cada pasta dentro de `app/` representa uma rota. O arquivo `page.tsx` dentro da pasta é automaticamente a página daquela rota — nenhuma configuração de router necessária.

---

## Service Pattern

O frontend nunca faz `fetch` direto nas páginas. Toda comunicação com o backend passa por um **service** dedicado:

```
page.tsx  →  service.ts  →  backend API
```

**Exemplo:**

```typescript
// services/pacientes.service.ts
export async function cadastrarPaciente(dto: CadastrarPacienteDto) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/pacientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<PacienteResponseDto>;
}
```

Isso isola a lógica HTTP, facilita testes e evita duplicação quando a mesma chamada é feita em mais de uma página.

---

## Autenticação no Frontend

Após o login bem-sucedido, o token JWT é armazenado e o tipo do usuário (`PACIENTE` ou `MEDICO`) determina o redirecionamento:

- `PACIENTE` → `/paciente`
- `MEDICO` → `/medico`

Todas as requisições autenticadas incluem o header:

```
Authorization: Bearer <token>
```

---

## Estilização

Cada componente tem seu próprio arquivo `.module.css`. As classes são escopadas automaticamente pelo Next.js, eliminando conflitos de nomes entre componentes:

```tsx
import styles from "./page.module.css";

<button className={styles.button}>Enviar</button>
```

As variáveis globais de cor, tipografia e espaçamento são definidas em `globals.css` e seguem a [Identidade Visual](../../projeto/identidade_visual.md) do projeto.
