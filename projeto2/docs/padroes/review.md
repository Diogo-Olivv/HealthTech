# Fluxo de Code Review

## Objetivo

O code review existe para garantir qualidade, compartilhamento de conhecimento e evolução saudável do projeto.

## Quando abrir um PR

Abrir Pull Request somente quando:

- A funcionalidade estiver funcional
- O escopo estiver claro
- O PR estiver pequeno o suficiente para ser revisado com qualidade

## Tamanho do PR

- Preferir PRs pequenos e objetivos.
- Se um PR misturar muitas responsabilidades, ele deve ser dividido.

## Estrutura obrigatória do PR

Todo PR deve conter:

- Contexto da tarefa
- O que foi feito
- Como testar
- Evidencias visuais, quando houver frontend
- Riscos ou pontos de atenção
- Checklist de segurança e logs, quando aplicável

## O que o Revisor deve verificar

- Design: a solução se encaixa bem na arquitetura?
- Funcionalidade: faz o que deveria fazer?
- Complexidade: está simples o bastante?
- Testes: há cobertura adequada?
- Nomes: estão claros?
- Comentários: explicam o necessário?
- Estilo: segue o padrão do projeto?
- Documentação: precisa atualizar MkDocs ou diagramas?

## Como comentar

- Criticar o código, não a pessoa.
- Explicar o motivo da sugestão.

## Aprovação

- Mínimo de 1 aprovacao de outro integrante.
- PR com impacto em arquitetura, segurança ou deploy deve ser revisado pelo líder técnico.

## Checklist antes do merge

- Branch atualizada
- Conflitos resolvidos
- Testes executados
- Padrões respeitados
- Documentação atualizada
- Logs implementados quando exigido

## Pós-merge

- Deletar branch da tarefa
- Atualizar quadro da sprint
- Registrar decisão importante na documentação, se necessário
