# Fluxo de Code Review

## Papéis

- **Autor:** abre o PR, garante CI verde, responde comentários.
- **Revisor(a):** revisa o diff em profundidade, valida o "porquê", e é responsável pelo merge quando aprovar.
- **Mantenedor(a):** integrantes com permissão de merge nas branches protegidas (`develop`, `main`, `docs`).

Um PR precisa de **pelo menos uma aprovação** de outro integrante antes do merge. Auto-merge não é permitido.

## Checklist do autor antes de abrir o PR

- [ ] `npm run lint` sem erros bloqueantes na camada tocada.
- [ ] `npm test` verde (unit e componente).
- [ ] `npm run test:e2e` verde quando o PR toca em rotas HTTP (backend).
- [ ] Migrations geradas e revisadas quando alterou entidade.
- [ ] Nenhum `console.log`, `TODO` sem issue, ou credencial no diff.
- [ ] Documentação atualizada (README, MkDocs, ADR, docstrings) quando aplicável.
- [ ] Preenche o [template de PR](template_PR.md) com o "porquê" da mudança.
- [ ] Marca a issue relacionada com `Closes #NN` quando o PR encerra a issue.

## O que o revisor procura

**Correção**

- A regra de negócio está correta e testada?
- Há caso de erro tratado no controller e/ou service?
- Guards e roles cobrem os cenários do endpoint?
- Auditoria (`@Audit`) foi aplicada onde deveria?

**Segurança**

- Nenhum campo sensível vaza para o response (ex.: `passwordHash`, `caminhoStorage`).
- Nenhum input passa direto para queries sem validação.
- Nenhuma nova rota escapa do `JwtAuthGuard` quando deveria estar protegida.

**Manutenção**

- Nomes claros no domínio do problema.
- Sem duplicação óbvia. Sem abstração prematura.
- Testes se leem como especificação e cobrem a intenção do PR.

**Impacto operacional**

- Precisa de migration? Ela é backward-compatible (ver [ADR-0001](../adr/0001-migrations-via-cloud-run-job.md))?
- Precisa de novo secret? Está no `.env.example` e será provisionado no Secret Manager?
- O deploy exige ação manual? Está documentado no PR?

## Tom do review

- **Foque no problema, não na pessoa.** "Este método está acumulando responsabilidades" em vez de "você misturou tudo".
- **Sugestões concretas.** Peça alterações com um caminho, mesmo que curto: "Prefiro extrair para `pacientesDisponiveis(medicoId)` porque separa a leitura da lista da regra de vínculo".
- **Reconheça o que ficou bom.** Um review que só aponta problemas cansa e desincentiva.

## Categorias de comentário

| Prefixo    | Significado                                                                 |
| ---------- | --------------------------------------------------------------------------- |
| `nit:`     | Preferência menor. Não bloqueia o merge.                                    |
| `question:`| Pergunta genuína para entender o "porquê" da escolha.                       |
| `suggestion:`| Proposta concreta que o autor pode acatar ou justificar.                  |
| `blocker:` | Precisa ser resolvido antes do merge (bug, segurança, quebra de contrato).  |

## Merge

- Prefira **Squash and merge** para features pequenas. O histórico de `develop` fica limpo.
- Use **Merge commit** para PRs de release entre `develop` e `main`, para preservar o histórico.
- **Nunca faça force push em `main`, `develop` ou `docs`.**
