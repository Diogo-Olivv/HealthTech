# Architecture Decision Records (ADRs)

Este diretório documenta as **decisões arquiteturais** relevantes do HealthTech.

Um ADR é um registro curto e imutável que responde três perguntas:

1. **Qual era o contexto?** (o problema e as restrições no momento da decisão)
2. **Qual foi a decisão?** (o caminho escolhido)
3. **Quais as consequências?** (o que ganhamos, o que perdemos, o que fica em dívida)

ADRs não são documentação viva. Eles congelam o "porquê" de uma escolha para que quem chegar depois entenda a lógica sem precisar arqueologia de commits.

## Quando escrever um ADR

Escreva um ADR quando a decisão:

- Afeta múltiplos módulos ou é difícil de reverter (ex.: escolha de ORM, formato de autenticação, estratégia de deploy).
- Envolve trade-off não óbvio entre alternativas viáveis.
- Precisa ser explicada de novo em toda code review ou onboarding.
- Introduz uma nova dependência de infra (banco, fila, serviço externo).

**Não escreva um ADR** para: escolha de biblioteca utilitária, refactors localizados, correções de bug, ou preferências de estilo. Isso vai no PR.

## Fluxo

1. **Copie o template**
   ```bash
   cp docs/desenvolvimento/adr/template.md docs/desenvolvimento/adr/NNNN-titulo-curto-em-kebab-case.md
   ```
   Use o próximo número sequencial disponível (`0002`, `0003`, ...). Nunca reaproveite um número.

2. **Preencha as seções**. Escreva no presente ("Optamos por...") e mantenha em menos de duas páginas. Se está ficando longo, provavelmente misturou duas decisões.

3. **Abra o PR** com status `Proposed`. A discussão acontece no PR, não no arquivo.

4. **Merge**: mude o status para `Accepted` e adicione a data. A partir daqui, o ADR é imutável, exceto para consertar erros de digitação.

5. **Superseding**: se uma decisão for revertida ou substituída, não edite o ADR original. Crie um novo ADR (`Accepted`) que faz referência ao antigo, e marque o antigo como `Superseded by ADR-NNNN`.

## Estados possíveis

| Status         | Significado                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `Proposed`     | Em discussão no PR. Ainda pode mudar.                                       |
| `Accepted`     | Decisão vigente. Norteia o código.                                          |
| `Deprecated`   | Não deve mais ser seguida, mas ainda não há substituto formal.              |
| `Superseded`   | Substituída por outro ADR. Deve apontar para o sucessor no cabeçalho.       |

## Convenções

- **Nome do arquivo:** `NNNN-titulo-em-kebab-case.md` (ex.: `0001-migrations-via-cloud-run-job.md`).
- **Idioma:** Português (mesmo padrão do restante do repositório).
- **Referências cruzadas:** use links relativos (`[ADR-0001](./0001-migrations-via-cloud-run-job.md)`).
- **Diagramas:** prefira Mermaid inline; se precisar de imagem, coloque em `docs/assets/diagramas/`.

## Índice

| #    | Título                                                                                  | Status   | Data       |
| ---- | --------------------------------------------------------------------------------------- | -------- | ---------- |
| 0001 | [Migrations do TypeORM via Cloud Run Job](./0001-migrations-via-cloud-run-job.md)       | Accepted | 2026-07-12 |

## Referências

- Michael Nygard, [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) (formato original de ADR).
- [adr.github.io](https://adr.github.io/) (coleção de templates e exemplos).
