# Template de Pull Request

O arquivo `.github/pull_request_template.md` no repositório aplica este template automaticamente a cada novo PR aberto. Esta página serve como referência para o time e como fonte única de verdade caso o arquivo precise ser reajustado.

## Estrutura

````markdown

## Descrição

<!-- Explique o "porquê" da mudança, não apenas o "o quê".
     O diff mostra o "o quê". O PR precisa mostrar o "porquê". -->

## Issue relacionada

<!-- Ex.: Closes #123, Refs #456. Use "Closes" apenas se este PR encerra a issue. -->
Closes #

## Tipo de mudança

- [ ] Bugfix (correção sem quebrar API)
- [ ] Feature (nova funcionalidade sem quebrar API)
- [ ] Breaking change (mudança incompatível com versão anterior)
- [ ] Refactor (sem mudança de comportamento observável)
- [ ] Style ou UI (formatação, CSS, sem lógica)
- [ ] Docs
- [ ] Testes
- [ ] Chore, Infra ou CI

## Escopo

- **Camada:** [ ] Backend  [ ] Frontend  [ ] Banco/Migration  [ ] Infra/Deploy  [ ] Docs
- **Envolve migration TypeORM:** [ ] Sim  [ ] Não
- **Envolve variáveis de ambiente ou secrets:** [ ] Sim  [ ] Não  <!-- se sim, liste abaixo -->
- **Envolve dados sensíveis ou LGPD:** [ ] Sim  [ ] Não

## Como testar

<!-- Passo a passo para o revisor validar localmente.
     Inclua comandos, URLs, usuários de teste, seeds, etc. -->

```bash
# ex.:
docker compose up -d
cd backend && npm run test
```

## Evidências

<!-- Screenshots, GIFs ou logs mostrando antes/depois.
     Obrigatório para PRs que afetam UI. -->

## Checklist do autor

- [ ] O código segue o padrão do projeto (`lint` e `test` passando localmente)
- [ ] Adicionei ou atualizei testes cobrindo a mudança
- [ ] Atualizei documentação relevante (README, comentários, ADR)
- [ ] Novas migrations foram testadas localmente e documentadas
- [ ] Novos secrets ou env vars foram adicionados ao `.env.example` e ao Secret Manager (se produção)
- [ ] Não deixei `console.log`, `TODO` sem issue, nem credenciais no diff
- [ ] Confirmei que o pre-commit (husky + lint-staged) rodou sem bypass (`--no-verify`)

## Impacto em deploy

- [ ] Requer nova migration, executada pelo Cloud Run Job `healthtech-migrations` no pipeline (ver [ADR-0001](../adr/0001-migrations-via-cloud-run-job.md))
- [ ] Requer atualização de `substitutions` no `cloudbuild.yaml`
- [ ] Requer novo secret no Secret Manager
- [ ] Requer ação manual pós-deploy (descrever abaixo)

<!-- Detalhe qualquer ação manual necessária: -->

## Contexto adicional ou decisões de design

<!-- Trade-offs, alternativas descartadas, links para discussões.
     Se a mudança é arquiteturalmente relevante, considere abrir um ADR
     em `docs/desenvolvimento/adr/` seguindo o template. -->
````

## Boas práticas de preenchimento

- **Descrição:** curta e focada no motivo. Se o PR passa de 300 linhas, o parágrafo do "porquê" fica ainda mais importante.
- **Como testar:** escreva do ponto de vista de quem nunca viu a branch. Comandos completos, URLs, seeds e usuários de teste.
- **Evidências:** UI sem screenshot é PR bloqueado. Se o teste E2E cobre o fluxo, cole o log de execução.
- **Impacto em deploy:** marcar mesmo quando a resposta for "não". Marcar explicitamente elimina ambiguidade em code review.
