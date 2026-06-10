# HealthTech — Identidade Visual & Componentes UI

## O que foi entregue

### 1. Documentação (`docs/projeto/identidade_visual.md`)
Paleta completa de cores (primária, secundária, neutros, semânticas), escala tipográfica com DM Sans, tokens de espaçamento e bordas, e exemplos de uso de todos os componentes.

---

### 2. CSS Global (`src/styles/globals.css`)
Variáveis CSS organizadas em:
- Cores: `--color-primary-*`, `--color-secondary-*`, `--color-gray-*`, `--color-success-*`, `--color-error-*`, `--color-warning-*`
- Tipografia: `--font-main`, `--text-*`, `--font-weight-*`
- Espaçamento: `--spacing-*`
- Bordas: `--radius-*`
- Sombras: `--shadow-*`
- Transições: `--transition-*`
- Animações: `ht-spin`, `ht-fade-in`

**Integração no Next.js:** adicione no `src/app/layout.jsx`:
```jsx
import '@/styles/globals.css';
```

---

### 3. Componentes Base (`src/components/ui/`)

#### `<Button />`
```jsx
import { Button } from '@/components/ui';

// Variantes
<Button variant="primary">Entrar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost">Voltar</Button>
<Button variant="danger">Excluir</Button>

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="md">Médio (padrão)</Button>
<Button size="lg">Grande</Button>

// Estados
<Button disabled>Desabilitado</Button>
<Button loading>Carregando...</Button>
<Button fullWidth>Largura total</Button>
```

#### `<Input />`
```jsx
import { Input } from '@/components/ui';

<Input
  label="E-mail"
  type="email"
  name="email"
  placeholder="seu@email.com"
  value={form.email}
  onChange={handleChange}
  error={errors.email}
  leftIcon={<MailIcon />}
  hint="Texto de ajuda opcional"
  required
  showPasswordToggle  // apenas para type="password"
/>
```

#### `<FeedbackMessage />`
```jsx
import { FeedbackMessage } from '@/components/ui';

<FeedbackMessage type="success" title="Sucesso!" message="Conta criada." />
<FeedbackMessage type="error" message="E-mail ou senha inválidos." />
<FeedbackMessage type="warning" message="Sessão expirando." />
<FeedbackMessage type="info" message="Sua conta está em análise." />
```

---

### 4. Páginas refatoradas

| Rota | Arquivo |
|---|---|
| `/login` | `src/app/login/page.jsx` |
| `/register/paciente` | `src/app/register/paciente/page.jsx` |
| `/register/medico` | `src/app/register/medico/page.jsx` |

Cada página usa:
- CSS Modules para estilos locais
- Variáveis globais do `globals.css`
- Componentes `Button`, `Input`, `FeedbackMessage`
- Validação de formulário com estados de erro por campo
- Layout responsivo (mobile-first)
- Acessibilidade: `aria-label`, `aria-invalid`, `aria-busy`, `aria-describedby`

---

### 5. Testes automatizados (`src/lib/__tests__/Button.test.jsx`)

Cobertura do componente `Button`:

| Caso de teste | Status |
|---|---|
| Renderiza texto filho | ✅ |
| type="button" por padrão | ✅ |
| Todas as variantes renderizam | ✅ |
| Todos os tamanhos renderizam | ✅ |
| Estado desabilitado — atributo `disabled` | ✅ |
| Estado desabilitado — `aria-disabled="true"` | ✅ |
| Estado desabilitado — onClick NÃO dispara | ✅ |
| Estado loading — spinner presente | ✅ |
| Estado loading — `aria-busy="true"` | ✅ |
| Estado loading — botão desabilitado | ✅ |
| Estado loading — onClick NÃO dispara | ✅ |
| Estado loading — texto filho visível | ✅ |
| Loading + Disabled combinados | ✅ |
| fullWidth renderiza sem erro | ✅ |
| Passa data-* e className extras | ✅ |

---

## Instalação das dependências de teste

```bash
npm install --save-dev jest jest-environment-jsdom \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event
```

Adicione no `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Integração no `layout.jsx` (Next.js App Router)

```jsx
// src/app/layout.jsx
import '@/styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```
