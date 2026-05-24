# Exemplo de Relatório STAR

## **Autor:** Diogo Oliveira

## **Perfil:** Júnior

## **Guia Técnico:** Lucas de Paula

## **Período:** 04/05/2026 a 17/05/2026

---

## O que foi entregue neste ciclo

- [#12](https://github.com/...) — Implementação da rota de autenticação de usuário e geração de token JWT.
- [#14](https://github.com/...) — Configuração do docker-compose e banco de dados para o ambiente de desenvolvimento.

---

## Desafios Técnicos Enfrentados

Padronização do ambiente local de desenvolvimento da equipe.

### Metodologia STAR

1. **S (Situação):** Durante a configuração inicial do backend, o ambiente local da equipe estava inconsistente. A conexão com o banco de dados funcionava corretamente na minha máquina, mas outros membros do grupo relataram falhas na inicialização e erros de permissão de pasta ao tentar rodar o banco localmente.
2. **T (Tarefa):** Como responsável pela estrutura base do backend neste ciclo, eu precisava garantir que o projeto rodasse de forma idêntica para todos os integrantes da equipe, eliminando problemas relacionados ao sistema operacional antes de avançarmos com o desenvolvimento das rotas.
3. **A (Ação):** Estruturei a aplicação utilizando contêineres Docker para isolar dependências. Configurei o `docker-compose.yml` para orquestrar o banco de dados e a API simultaneamente. Criei um script `fix-perms.sh` para corrigir o mapeamento de volumes em ambientes Ubuntu/Linux, resolvendo os conflitos de permissão que impediam a persistência dos dados.
4. **R (Resultado):** O tempo de setup foi reduzido para poucos minutos. Toda a equipe passou a iniciar o banco e a aplicação com um único comando, eliminando o "na minha máquina funciona" e destravando as entregas do ciclo.

---

## Dívidas Técnicas e Dicas para o Próximo Ciclo

- Os testes unitários das rotas de autenticação não foram finalizados — prioridade para o Ciclo 2.
- O `fix-perms.sh` foi testado apenas em Ubuntu; verificar comportamento no macOS.

## Avaliação do Guia Técnico

- O meu Guia poderia ter sido um pouco mais comunicativo em certos momentos, o contato era difícil e ele demorou pra me responder em alguns momentos.
- Nos momentos que me respondia, foi um ótimo Guia, proporcionando a ajuda que eu precisava.
---

## Avaliação do Guia Técnico - Seção do Guia Técnico

<!-- Essa seção apenas o Guia técnico responsável pelo Júnior preenche-->

> Preenchido por: **Lucas de Paula** (Guia do Ciclo 1)

**Guia:** Lucas de Paula

### Acompanhamento realizado

- 2 sessões de pair programming (configuração do Docker e implementação do JWT).
- Code review detalhado nos PRs #12 e #14 com comentários explicativos.
- Reunião de alinhamento no início do ciclo para definir escopo do Backend.

### Avaliação de evolução

| Critério                      | Observação                                                             |
| ----------------------------- | ---------------------------------------------------------------------- |
| Autonomia técnica             | Boa — resolveu a maioria dos problemas sozinho após orientação inicial |
| Qualidade das entregas        | PRs dentro do padrão, com commits bem descritos                        |
| Comunicação de impedimentos   | Comunicou o problema de permissão rapidamente, sem travar o ciclo      |
| Adoção dos padrões do projeto | Seguiu as convenções de Git e código sem necessidade de retrabalho     |

### Pontos fortes observados

- Proatividade na documentação do `docker-compose.yml`.
- Boa leitura dos requisitos antes de implementar.

### Pontos de atenção para o próximo ciclo

- Priorizar a escrita de testes junto com a feature, não depois.
- Aprofundar o entendimento de isolamento de dados por usuário antes de assumir rotas de upload.

### Débitos técnicos gerados por falta de suporte ou contexto

- A integração com o Cloud SQL não foi orientada neste ciclo — responsabilidade do Guia do Ciclo 2 cobrir esse contexto antes de iniciar a feature de storage.
