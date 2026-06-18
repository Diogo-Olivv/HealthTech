# Issue #18 - Refatoração visual das páginas de Cadastro e Login

**Tipo:** Frontend

**Status:** Concluída

**Responsáveis:** [Hugo Rosa](https://github.com/HugoRosa29), [Gabriel Robson](https://github.com/Gabrielxcx)

---

## Descrição

Como usuário, quero que as páginas de cadastro e login tenham identidade visual consistente para reconhecer o sistema e ter uma experiência clara e profissional.

## Tarefas

- [x] Popular `globals.css` com variáveis CSS (`--color-primary`, `--color-error`, etc.)
- [x] Documentar a identidade visual em `docs/projeto/identidade_visual.md`
- [x] Refatorar página `/register/paciente` com a nova identidade visual
- [x] Refatorar página `/register/medico` com a nova identidade visual
- [x] Refatorar página `/login` com a nova identidade visual
- [x] Padronizar componentes reutilizáveis (botão, input, mensagens) em CSS Modules
- [x] Garantir responsividade básica (desktop e mobile)

## Critérios de Aceitação

- Paleta de cores documentada com códigos hexadecimais.
- Variáveis CSS centralizadas em um único arquivo.
- Páginas de cadastro e login compartilham a mesma identidade visual.
- Layout responsivo em desktop e mobile.
- Documento `identidade_visual.md` contém paleta, tipografia e exemplos de componentes.

## Critérios de Teste

- React Testing Library: botão padronizado renderiza corretamente nos estados normal, desabilitado e loading.
