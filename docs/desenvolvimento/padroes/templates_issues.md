# Templates de Issue

O repositório fornece três templates de issue no diretório `.github/ISSUE_TEMPLATE/`. Esta página documenta o propósito de cada um e reproduz o conteúdo canônico.

## Bug Report

Use para reportar comportamento inesperado. Traga passos de reprodução, ambiente e evidências.

```markdown
---
name: 🐛 Bug Report
about: Reporte um comportamento inesperado para nos ajudar a corrigir
title: "[BUG] "
labels: ["bug", "triage"]
assignees: []
---

## Descrição do bug
<!-- Descreva de forma clara e objetiva o que está acontecendo. -->

## Passos para reproduzir
1. Acesse '...'
2. Clique em '...'
3. Preencha '...'
4. Veja o erro

## Comportamento esperado
<!-- O que deveria ter acontecido? -->

## Comportamento atual
<!-- O que de fato aconteceu? Cole mensagens de erro, stack traces ou logs relevantes. -->

```
<cole logs aqui>
```

## Screenshots / Vídeos
<!-- Se aplicável, adicione imagens ou gravações para ilustrar o problema. -->

## Ambiente
- **Camada afetada:** [ ] Backend  [ ] Frontend  [ ] Infra/Deploy  [ ] Banco
- **SO:** (ex.: Ubuntu 24.04, macOS 14, Windows 11)
- **Navegador + versão:** (ex.: Chrome 126)
- **Node.js:** `node -v`
- **Ambiente:** [ ] Local (docker-compose)  [ ] Staging  [ ] Produção (Cloud Run)
- **Commit / Branch:** (ex.: `main @ abc1234`)

## Impacto
- [ ] Bloqueante (usuário não consegue usar o fluxo)
- [ ] Alto (funcionalidade quebrada, mas há workaround)
- [ ] Médio (comportamento estranho, sem bloquear)
- [ ] Baixo (cosmético)

## Contexto adicional
<!-- Qualquer informação extra: quando começou, se é intermitente, correlação com deploys, etc. -->

## Checklist
- [ ] Verifiquei que não existe issue aberta para o mesmo problema
- [ ] Consegui reproduzir localmente ou anexei evidências suficientes
- [ ] Removi qualquer dado sensível (tokens, senhas, CPFs reais) dos logs anexados
```

## Feature Request

Use para propor uma nova funcionalidade ou melhoria. Descreva primeiro o problema, depois a solução.

```markdown
---
name: ✨ Feature Request
about: Sugira uma nova funcionalidade ou melhoria
title: "[FEATURE] "
labels: ["enhancement", "triage"]
assignees: []
---

## Problema / Motivação
<!-- Qual dor essa feature resolve? Para quem? Evite descrever a solução aqui, foque no problema. -->

## Solução proposta
<!-- Descreva a experiência desejada. Se possível, escreva como user story:
"Como <perfil>, quero <ação> para <benefício>." -->

## Critérios de aceite
- [ ] ...
- [ ] ...
- [ ] ...

## Alternativas consideradas
<!-- Outras abordagens que você pensou e por que foram descartadas. -->

## Escopo
- **Camada afetada:** [ ] Backend  [ ] Frontend  [ ] Banco/Migration  [ ] Infra/Deploy  [ ] Documentação
- **Impacto em usuários existentes:** [ ] Nenhum  [ ] Requer migração  [ ] Breaking change
- **Envolve dados sensíveis (LGPD):** [ ] Sim  [ ] Não

## Mockups / Referências
<!-- Links do Figma, prints, ou exemplos de outros produtos. -->

## Contexto adicional
<!-- Dependências com outras issues, prazos, discussões prévias. -->

## Checklist
- [ ] Verifiquei que não existe issue/discussion aberta com a mesma proposta
- [ ] O problema está descrito de forma independente da solução
- [ ] Os critérios de aceite são testáveis
```

## Auditoria

Use para issues específicas da camada de auditoria (LGPD e HIPAA). Sempre referencie o plano de auditoria e detalhe critérios de teste.

```markdown
---
name: Auditoria
about: Template padrão para issues da camada de auditoria (LGPD/HIPAA)
title: "[Auditoria] "
labels: ["auditoria"]
assignees: []
---

## Tipo

Backend / Frontend / Infra / Documentação

## Equipe responsável

Time que vai executar a issue.

## Labels sugeridas

`auditoria`, `backend` ou `frontend` ou `infra`, `lgpd`.

## Dependências

Liste issues que precisam estar concluídas antes desta.

## Descrição

Como <persona>, quero <ação> para <resultado>.

## Tarefas

- [ ] Tarefa 1
- [ ] Tarefa 2
- [ ] Tarefa 3

## Critérios de Aceitação

- Critério 1
- Critério 2

## Critérios de Teste

- Jest unitário: descrever cenários
- Supertest integração: descrever cenários

## Referências

- Plano de auditoria (documento do time).
```
