# Commits e Branches

## Branch principal

- A branch `main` é protegida.
- Ninguém faz commit direto na `main`.
- Toda alteração entra por Pull Request.

## Estrutura de branches

Padrão de nome:

- `feature/<descricao-curta>`
- `fix/<descricao-curta>`
- `docs/<descricao-curta>`
- `refactor/<descricao-curta>`
- `hotfix/<descricao-curta>`

Exemplos:

- `feature/auth-jwt`
- `fix/upload-validacao-arquivo`
- `docs/padrao-code-review`

## Regra de criação

- Cada tarefa do backlog deve gerar sua própria branch.
- Branch deve sair da `main` atualizada.
- Ao terminar, abrir Pull Request para `main`.

## Commits

Padrão obrigatório:
`<tipo>(escopo opcional): <descricao curta>`

Tipos permitidos:

- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: documentação
- `refactor`: refatoração sem alterar comportamento
- `test`: criação ou ajuste de testes
- `chore`: manutenção técnica
- `ci`: pipeline, automação e deploy
- `build`: dependências e empacotamento

Exemplos:

- `feat(auth): adicionar login com JWT`
- `fix(upload): corrigir associação de arquivo ao usuario`
- `docs(mkdocs): atualizar arquitetura da semana 7`
- `ci(cloud-run): ajustar deploy automatico`

## Regras para commits

- Um commit deve representar uma mudança lógica única.
- Evitar commit misturando frontend, backend e documentação sem necessidade.
- Mensagem sempre no imperativo.
- Descrição curta e objetiva.
- Commits temporários como `teste`, `ajustes`, `wip` e `final` não são permitidos.

## Pull Request

- PR pequeno e conciso.
- Antes de abrir um PR, atualizar a branch com a `main`.
- Se houver muitos commits confusos, fazer squash antes de abrir o PR.
