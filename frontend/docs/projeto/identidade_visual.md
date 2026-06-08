# Identidade Visual — HealthTech

## 1. Paleta de Cores

### Cor Primária — Azul Médico
| Nome | Hex | Uso |
|---|---|---|
| `primary-50` | `#EFF6FF` | Fundos sutis, hover suave |
| `primary-100` | `#DBEAFE` | Backgrounds de cards informativos |
| `primary-200` | `#BFDBFE` | Bordas leves, divisores |
| `primary-500` | `#3B82F6` | Botões secundários, ícones |
| `primary-600` | `#2563EB` | **Cor principal — botões CTA, links** |
| `primary-700` | `#1D4ED8` | Hover de botões primários |
| `primary-900` | `#1E3A8A` | Textos de destaque, headers |

### Cor Secundária — Teal / Verde-Azulado
| Nome | Hex | Uso |
|---|---|---|
| `secondary-400` | `#2DD4BF` | Acentos visuais, badges |
| `secondary-500` | `#14B8A6` | Ícones complementares |
| `secondary-600` | `#0D9488` | Hover de elementos secundários |

### Neutros
| Nome | Hex | Uso |
|---|---|---|
| `gray-50` | `#F8FAFC` | Background geral de página |
| `gray-100` | `#F1F5F9` | Fundos de cards |
| `gray-300` | `#CBD5E1` | Bordas de inputs |
| `gray-500` | `#64748B` | Textos auxiliares / placeholders |
| `gray-700` | `#334155` | Textos secundários |
| `gray-900` | `#0F172A` | Texto principal |
| `white` | `#FFFFFF` | Superfícies, cards |

### Cores Semânticas
| Nome | Hex | Uso |
|---|---|---|
| `success-500` | `#22C55E` | Ícone de sucesso |
| `success-600` | `#16A34A` | Texto de sucesso, borda |
| `success-50` | `#F0FDF4` | Background de mensagem de sucesso |
| `error-500` | `#EF4444` | Ícone de erro |
| `error-600` | `#DC2626` | Texto de erro, borda |
| `error-50` | `#FEF2F2` | Background de mensagem de erro |
| `warning-500` | `#F59E0B` | Ícone de alerta |
| `warning-600` | `#D97706` | Texto de alerta |
| `warning-50` | `#FFFBEB` | Background de mensagem de alerta |

---

## 2. Tipografia

### Fonte Principal: **DM Sans**
- Importar via Google Fonts: `DM Sans` (400, 500, 600, 700)
- Fallback: `system-ui, -apple-system, sans-serif`

### Escala Tipográfica
| Token | Tamanho | Peso | Line-height | Uso |
|---|---|---|---|---|
| `text-xs` | 12px | 400 | 1.5 | Labels, badges |
| `text-sm` | 14px | 400 / 500 | 1.5 | Textos auxiliares, labels de input |
| `text-base` | 16px | 400 | 1.6 | Corpo de texto padrão |
| `text-lg` | 18px | 500 | 1.5 | Subtítulos, destaques |
| `text-xl` | 20px | 600 | 1.4 | Títulos de seção |
| `text-2xl` | 24px | 700 | 1.3 | Títulos de página |
| `text-3xl` | 30px | 700 | 1.2 | Headings principais |

---

## 3. Componentes — Exemplos de Uso

### Botão Primário
```jsx
<Button variant="primary">Entrar</Button>
// Cor: primary-600 | Hover: primary-700 | Texto: branco
```

### Botão Secundário
```jsx
<Button variant="secondary">Cancelar</Button>
// Cor: branco | Borda: primary-600 | Texto: primary-600 | Hover: primary-50
```

### Botão Desabilitado
```jsx
<Button variant="primary" disabled>Entrar</Button>
// Cor: gray-300 | Texto: gray-500 | Cursor: not-allowed
```

### Botão Loading
```jsx
<Button variant="primary" loading>Entrando...</Button>
// Spinner animado + texto | Interação bloqueada
```

### Input Padrão
```jsx
<Input label="Email" type="email" placeholder="seu@email.com" />
// Borda: gray-300 | Foco: primary-600 ring | Erro: error-600 borda
```

### Mensagem de Sucesso
```jsx
<FeedbackMessage type="success" message="Cadastro realizado!" />
// Background: success-50 | Borda: success-600 | Ícone verde
```

### Mensagem de Erro
```jsx
<FeedbackMessage type="error" message="Email ou senha inválidos." />
// Background: error-50 | Borda: error-600 | Ícone vermelho
```

---

## 4. Espaçamento e Bordas

- **Border-radius padrão (inputs/botões):** `8px` (`rounded-lg`)
- **Border-radius cards:** `12px` (`rounded-xl`)
- **Sombra de card:** `0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)`
- **Espaçamento interno (padding) de botão:** `12px 24px` (md), `10px 20px` (sm)

---

## 5. Regras de Acessibilidade

- Contraste mínimo de **4.5:1** para texto sobre fundos coloridos
- Todos os inputs possuem `label` e `aria-describedby` para erros
- Botões com estado loading usam `aria-busy="true"`
- Botões desabilitados usam `disabled` nativo (não apenas visual)
