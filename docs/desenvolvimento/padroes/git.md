# Git e Branches

Esta página consolida as convenções de branch, commits e Pull Requests do HealthTech. O objetivo é manter o histórico legível e o fluxo previsível para todos os integrantes.

## Modelo de branches

O projeto usa três tipos de branch, com papéis claros:

| Branch     | Papel                                                                              |
| ---------- | ---------------------------------------------------------------------------------- |
| `main`     | Última versão estável e passível de deploy. Só recebe merge via PR aprovado.       |
| `develop`  | Integração contínua das features do ciclo atual. Base de todo trabalho novo.       |
| `docs`     | Documentação MkDocs publicada via GitHub Pages. Isolada do código de aplicação.    |
| `feat/*`, `fix/*`, `refactor/*`, `chore/*` | Branches de trabalho de curto prazo, sempre criadas a partir de `develop`. |

**Push direto em `main`, `develop` ou `docs` não é permitido.** Toda mudança entra por Pull Request.

## Nomenclatura de branches

Use o padrão `tipo/descricao-curta`, tudo em kebab-case:

```
feat/upload-arquivos
fix/login-cors
refactor/vinculo-medico-paciente
chore/governance-adrs
docs/atas-semana-13
```

Se a branch resolve uma issue, mencione-a nos commits ou no PR, não no nome da branch.

## Padrão de commits (Conventional Commits)

Seguimos [Conventional Commits](https://www.conventionalcommits.org/pt-br/). Cada commit tem a forma `tipo(escopo): mensagem curta no imperativo`.

| Tipo       | Quando usar                                                    |
| ---------- | -------------------------------------------------------------- |
| `feat`     | Nova funcionalidade visível ao usuário ou nova API             |
| `fix`      | Correção de bug                                                |
| `refactor` | Reorganização sem mudança de comportamento observável          |
| `test`     | Adição ou ajuste de testes                                     |
| `docs`     | Mudança somente em documentação                                |
| `chore`    | Tarefas auxiliares (deps, scripts, infra de dev)               |
| `style`    | Formatação, espaços, ponto e vírgula (sem lógica)              |
| `ci`       | Ajustes em pipeline (`cloudbuild.yaml`, GitHub Actions)        |

Exemplos reais do histórico:

```
feat(arquivos): adiciona auditoria de rotas, testes e refatora tipagem AuthRequest (Resolve #54)
fix(vinculo): fecha modal antes alert
refactor(auth): centraliza interface AuthRequest e remove casts inseguros (Resolve #54)
docs(audit): documenta GET /audit/logs no README do backend
ci: adiciona workflow CodeQL
```

## Commits atômicos

Cada commit deve representar uma mudança coesa e revisar sozinho. Regra prática:

- Um commit por ideia. Não misture "corrigir bug de login" com "adicionar seed de admin".
- A mensagem descreve **por que**, não somente **o quê**. O diff mostra o "o quê".
- Se você precisa de `e` na mensagem, provavelmente são dois commits.

## Vinculando commits a issues

Use `Resolve #NN`, `Closes #NN` ou `Refs #NN` no corpo do commit ou do PR. O GitHub fecha a issue automaticamente ao mergear o PR.

## Pre-commit e lint-staged

Toda contribuição passa pelo hook do Husky antes de virar commit. O script `pre-commit` roda `npx --no-install lint-staged`, que executa o ESLint (com `--fix`) apenas nos arquivos em stage:

```js
// lint-staged.config.js
module.exports = {
  "backend/**/*.ts": scoped("backend"),
  "frontend/**/*.{ts,tsx,js,jsx,mjs}": scoped("frontend"),
};
```

Não use `--no-verify` para pular o hook, exceto em situação excepcional documentada no PR. Se o hook está falhando por conta de configuração, corrija a raiz do problema.

## Fluxo padrão de contribuição

1. `git checkout develop && git pull` para partir da base atualizada.
2. `git checkout -b feat/descricao-curta`.
3. Commits pequenos, mensagens em Conventional Commits.
4. `npm run lint` e `npm test` na camada (backend ou frontend) que você tocou.
5. `git push -u origin <branch>` e abra o Pull Request contra `develop` usando o [template](template_PR.md).
6. Revisão por pelo menos um outro integrante. CI verde.
7. Merge por um mantenedor. A branch é apagada após o merge.

`main` só recebe merge a partir de `develop` em pontos de release, através de PR próprio.
