# Identidade Visual

Esta página documenta os padrões e diretrizes de identidade visual do projeto **HealthTech**, projetados para criar uma interface consistente, profissional e moderna.

---

## 1. Tema & Estilo

> **Diretriz Geral**
>
> O design da plataforma HealthTech deve evocar um ambiente médico clínico, estéril, altamente profissional e tecnológico, mas ao mesmo tempo acolhedor e humanizado. A interface deve priorizar a clareza, a precisão e a acessibilidade.
>
> - **Minimalista e Robusto:** Sem elementos puramente decorativos ou desnecessários. Toda interface serve à funcionalidade e à legibilidade.
> - **Alto Contraste:** Relação estrita de contraste para garantir que pacientes e médicos possam ler as informações sem fadiga ocular.
> - **Visual Clean:** Espaço em branco generoso (grid bem espaçado) para permitir que a informação "respire".

---

## 2. Paleta de Cores

A paleta de cores foi selecionada para balancear a autoridade da área clínica com a inovação da tecnologia em saúde.

### Cores Principais

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin: 1.5rem 0;">
  <!-- Primary -->
  <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-align: left;">
    <div style="background-color: #1e4969; height: 80px; border-radius: 6px; margin-bottom: 0.75rem; border: 1px solid rgba(0,0,0,0.05);"></div>
    <strong style="color: #1a1a1a; font-size: 1rem;">Primária (Ações & Branding)</strong>
    <div style="font-family: monospace; font-size: 0.9rem; color: #1e4969; margin: 0.25rem 0;">#1e4969</div>
    <div style="font-size: 0.85rem; color: #595959; line-height: 1.3;">Deep Clinical Blue. Representa autoridade, segurança e confiança. Utilizada em ações principais, cabeçalhos e branding.</div>
  </div>
  <!-- Secondary -->
  <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-align: left;">
    <div style="background-color: #368ca0; height: 80px; border-radius: 6px; margin-bottom: 0.75rem; border: 1px solid rgba(0,0,0,0.05);"></div>
    <strong style="color: #1a1a1a; font-size: 1rem;">Secundária (Estados Ativos & Badges)</strong>
    <div style="font-family: monospace; font-size: 0.9rem; color: #368ca0; margin: 0.25rem 0;">#368ca0</div>
    <div style="font-size: 0.85rem; color: #595959; line-height: 1.3;">Ocean Blue. Representa tecnologia moderna e vitalidade. Utilizada para estados ativos, badges, links e detalhes técnicos.</div>
  </div>
  <!-- Background Canvas -->
  <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-align: left;">
    <div style="background-color: #f8fafc; height: 80px; border-radius: 6px; margin-bottom: 0.75rem; border: 1px solid #cbd5e1;"></div>
    <strong style="color: #1a1a1a; font-size: 1rem;">Fundo / Canvas</strong>
    <div style="font-family: monospace; font-size: 0.9rem; color: #64748b; margin: 0.25rem 0;">#f8fafc | #ffffff</div>
    <div style="font-size: 0.85rem; color: #595959; line-height: 1.3;">Slate 50 (tela de fundo confortável) e Branco Puro (#ffffff) para cartões, seções e contêineres de conteúdo.</div>
  </div>
</div>

### Cores de Texto e Apoio

| Categoria            | Cor / Hex                 |                                                                       Visual                                                                        | Função / Aplicação                                            |
| :------------------- | :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------ |
| **Texto Primário**   | `#1a1a1a` (Dark Slate)    | <span style="display:inline-block;width:2em;height:1.2em;background:#1a1a1a;border:1px solid #ccc;border-radius:4px;vertical-align:middle;"></span> | Títulos, parágrafos importantes e inputs (alta legibilidade). |
| **Texto Secundário** | `#595959` (Medium Gray)   | <span style="display:inline-block;width:2em;height:1.2em;background:#595959;border:1px solid #ccc;border-radius:4px;vertical-align:middle;"></span> | Metadados, descrições secundárias, timestamps e legendas.     |
| **Sucesso**          | `#70C1A3` (Emerald Light) | <span style="display:inline-block;width:2em;height:1.2em;background:#70C1A3;border:1px solid #ccc;border-radius:4px;vertical-align:middle;"></span> | Estados de sucesso, confirmações e feedbacks positivos.       |
| **Alerta**           | `#f2b138` (Amber)         | <span style="display:inline-block;width:2em;height:1.2em;background:#f2b138;border:1px solid #ccc;border-radius:4px;vertical-align:middle;"></span> | Avisos, pendências e chamadas de atenção moderadas.           |
| **Erro**             | `#e14c4c` (Coral Red)     | <span style="display:inline-block;width:2em;height:1.2em;background:#e14c4c;border:1px solid #ccc;border-radius:4px;vertical-align:middle;"></span> | Estados críticos, validações incorretas e erros do sistema.   |

---

## 3. Tipografia

A tipografia do sistema utiliza uma única família de fontes para manter a consistência e otimizar o carregamento.

- **Família de Fonte:** `Inter` (Google Fonts)
- **Carregamento Recomendado:**
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
  ```

### Pesos de Fonte Definidos

> **Diretriz de Pesos**
>
> - **Títulos (H1 / H2):** `Bold (700)` ou `Semi-Bold (600)`: garante impacto e hierarquia clara.
> - **Subtítulos:** `Medium (500)`: para rotular seções e destaques secundários.
> - **Corpo de Texto & Inputs:** `Regular (400)`: otimizado para leitura contínua e inserção de dados.

### Escala de Tamanhos Recomendada

- **Título Principal (H1):** `3rem` (48px), altura de linha: `1.2`
- **Título de Seção (H2):** `2.25rem` (36px), altura de linha: `1.3`
- **Subtítulos (H3):** `1.75rem` (28px), altura de linha: `1.4`
- **Corpo do Texto:** `1rem` (16px), altura de linha padrão: `1.5`
- **Textos de Apoio / Legendas:** `0.875rem` (14px), altura de linha: `1.4`

---

## 4. Conceito do Logo

A marca visual do HealthTech foi repensada para conectar de forma simples os dois pilares da plataforma: a **prática médica/clínica** e a **inovação tecnológica em nuvem**.

### Composição do Logo

  <!-- Ícone SVG (usar sempre vetorial para escalabilidade) -->
  <figure style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;margin:1rem 0;">
    <!-- Coloque o arquivo do ícone SVG em: docs/assets/logo/icon.svg -->
    <!-- Uso recomendado (img): preserva cache e acessibilidade -->
    <img src="/assets/logo/Icon.svg" alt="Ícone HealthTech (SVG)" style="width:96px;height:auto;" />
    <figcaption style="color:#595959;font-size:0.95rem;">Ícone SVG da marca</figcaption>
  </figure>

  <!-- Versões completas do logotipo -->
  <figure style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;margin:1rem 0;">
    <img src="/assets/logo/logo-fundo-azul.png" alt="Logotipo HealthTech sobre fundo azul" style="max-width:360px;width:100%;height:auto;" />
    <figcaption style="color:#595959;font-size:0.95rem;">Logotipo HealthTech sobre fundo azul</figcaption>
  </figure>
  
  <figure style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;margin:1rem 0;">
    <img src="/assets/logo/logo-fundo-branco.png" alt="Logotipo HealthTech sobre fundo branco" style="max-width:360px;width:100%;height:auto;" />
    <figcaption style="color:#595959;font-size:0.95rem;">Logotipo HealthTech sobre fundo branco</figcaption>
  </figure>

  <!-- Exemplo de embed inline (quando precisar controlar cores via CSS): -->
  <!-- <div class="logo-inline">(incluir o conteúdo de docs/assets/logo/icon.svg aqui)</div> -->

- **Parte Textual:**
  A palavra **"Health"** deve ser estilizada em **Negrito (Bold 700)** e a palavra **"Tech"** em **Regular (400)**, ambas usando a tipografia _Inter_. Isso cria uma diferenciação sutil e elegante.
- **Parte do Ícone:**
  Localizado sempre à **esquerda** da parte textual. O ícone consiste em um documento de exame médico (folha de papel) limpo com cantos arredondados. As linhas internas horizontais de texto do documento transitam sutilmente para uma onda de pulso cardíaco eletrônico (onda de dados). Um ícone de nuvem/upload extremamente sutil e pequeno fica localizado em um dos cantos do documento.

> **Disponibilidade de Assets**
>
> Os arquivos vetoriais originais e suas variações históricas estão organizados na pasta `docs/assets/logo/`. Para novos desenvolvimentos, a nova estrutura de ícone deve ser adaptada mantendo a sobriedade e o alinhamento com a paleta de cores.

---

## 5. Diretrizes de Imagens

Para apoiar a proposta de um ambiente clínico moderno e acolhedor, as imagens e gráficos devem seguir regras rígidas de curadoria.

### Tipos Permitidos

- **Fotografia Profissional:** Profissionais de saúde reais em ambientes bem iluminados, transmitindo empatia, foco e precisão.
- **Ícones Lineares (Outline):** Ícones minimalistas com linhas de `2px`, utilizando cores da paleta principal.
- **Ilustrações Tecnológicas:** Vetores simples com poucos gradientes, focando na clareza da mensagem.

### Tratamento Visual

- **Filtros e Cores:** Cores naturais e realistas. Tons ligeiramente frios e neutros são bem-vindos para reforçar a atmosfera clínica.
- **Contraste:** Excelente nitidez e brilho para evitar sombras pesadas ou atmosferas sombrias.

### O que evitar

- ❌ Fotos clichês de banco de imagens (ex: médicos com sorrisos artificiais olhando diretamente para a câmera de forma exagerada).
- ❌ Gráficos ou ilustrações muito infantis ou caricatos.
- ❌ Ambientes escuros, equipamentos médicos desatualizados ou desorganizados.

---

## 6. Layout e Espaçamentos

A plataforma adota um sistema de grid fluido com as seguintes especificações para manter a consistência estrutural:

- **Espaçamento entre Seções:** `3rem` (48px)
- **Margens e Paddings de Contêineres:** `1.5rem` (24px)
- **Tamanho padrão de Ícones:** `24px` a `32px`
- **Arredondamento de Cantos (Border Radius):** `8px` para cartões (cards) e botões principais; `12px` para grandes contêineres e modais.
- **Botões:** Tamanho de texto de `1rem` a `1.125rem` (16-18px) com padding interno balanceado (ex: `12px 24px`).

```css
/* Exemplo de aplicação prática das variáveis no CSS do projeto */
:root {
  --primary-color: #1e4969;
  --secondary-color: #368ca0;
  --background-canvas: #f8fafc;
  --background-card: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #595959;

  --font-family: "Inter", sans-serif;

  --spacing-container: 1.5rem;
  --spacing-section: 3rem;
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
}
```
