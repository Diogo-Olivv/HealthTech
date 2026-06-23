# Contribuindo com o HealthTech

Obrigado pelo interesse em contribuir! Este documento descreve o fluxo de trabalho do projeto. Para ambiente de desenvolvimento e variáveis, veja a seção [Quick Start](README.md#quick-start-ambiente-local) do `README.md`.

## Fluxo de trabalho

1. Crie sua branch a partir de `develop` seguindo a convenção `tipo/descricao-curta` (ex.: `feat/upload-arquivos`, `fix/login-cors`).
2. Faça commits pequenos e atômicos seguindo o padrão **Conventional Commits**.
3. Garanta que **build, lint e testes** passem localmente antes de abrir o PR.
4. Abra o Pull Request contra `develop`. Use a descrição para explicar o **porquê** da mudança, não só o **o quê**.
5. Após review e CI verde, o merge é feito por um mantenedor.

> `main` é a última versão estável. Push direto em `main` ou `develop` não é permitido.

## Padrão de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/pt-br/). Tipos usados no histórico:

| Tipo       | Quando usar                                            |
| ---------- | ------------------------------------------------------ |
| `feat`     | Nova funcionalidade visível ao usuário ou nova API     |
| `fix`      | Correção de bug                                        |
| `refactor` | Reorganização sem mudança de comportamento             |
| `test`     | Adição ou ajuste de testes                             |
| `docs`     | Mudança somente em documentação                        |
| `chore`    | Tarefas auxiliares (deps, scripts, infra de dev)       |
| `style`    | Formatação, espaços, ponto-e-vírgula (sem lógica)      |

Exemplos:
```
feat(arquivos): adiciona endpoint de download
fix(auth): corrige expiracao do token JWT
refactor(db): migra synchronize para migrations
```

## Antes de abrir o PR

Rode na raiz do backend (ou frontend):

```bash
cd backend
npm run lint
npm test
npm run test:e2e        # exige docker compose up postgres -d
npm run build
```

### Mudanças no banco

Qualquer alteração em entidade `backend/src/entities/*.ts` exige migration commitada. `synchronize` está desligado em todos os ambientes.

```bash
cd backend
npm run migration:generate -- src/migrations/NomeDescritivo
```

Revise o SQL gerado e inclua a migration no mesmo PR da entidade. Mais detalhes em [Banco de Dados e Migrations](README.md#banco-de-dados-e-migrations).

## Estilo de código

- **TypeScript estrito**: nada de `any` sem motivo registrado.
- **ESLint + Prettier** já configurados; `npm run lint` corrige a maioria dos problemas.
- **Testes**: toda funcionalidade nova vem com teste. Bug fix vem com teste de regressão.
- **Sem segredos no repo**: use `.env` (gitignored) localmente e Secret Manager em produção.

## Reportando bugs e sugerindo features

- Bugs e features: abra uma [issue](https://github.com/Diogo-Olivv/HealthTech/issues).
- Vulnerabilidades de segurança: **não abra issue pública**. Veja a seção [Política de Segurança](README.md#política-de-segurança) do README.

## Code of Conduct

Toda interação no projeto é regida pelo [Code of Conduct](CODE_OF_CONDUCT.md). Ao contribuir, você concorda em segui-lo.
