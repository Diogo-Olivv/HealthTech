# DevOps

**Stack do projeto:** Docker + Cloud Run + Cloud SQL + GitHub Actions (CI/CD a ser definido)

---

## Etapa 1: Fundamentos

- [The Twelve-Factor App](https://12factor.net/pt_br/)
- [Roadmap.sh: DevOps](https://roadmap.sh/devops)

### Conceitos principais

- Diferença entre dev/staging/prod
- Variáveis de ambiente e secrets
- Build vs runtime
- Imutabilidade de artefatos

---

## Etapa 2: CI/CD

- [GitHub Actions: Documentação oficial](https://docs.github.com/en/actions)
- [GitHub Actions: Quickstart](https://docs.github.com/en/actions/quickstart)
- [Fireship: GitHub Actions in 100s](https://www.youtube.com/watch?v=R8_veQiYBjI)
- Pipeline padrão do projeto:
  ```
  push -> lint -> test -> build -> deploy (Cloud Run)
  ```

### Conceitos principais

- Workflows, jobs, steps
- Triggers (`push`, `pull_request`, `workflow_dispatch`)
- Secrets do GitHub
- Cache de dependências (`actions/cache`)

---

## Etapa 3: Google Cloud Run

- [Cloud Run: Visão geral](https://cloud.google.com/run/docs/overview/what-is-cloud-run)
- [Deploy de container no Cloud Run](https://cloud.google.com/run/docs/deploying)
- [Cloud Run: Variáveis de ambiente](https://cloud.google.com/run/docs/configuring/environment-variables)
- [Cloud Run: Conectar ao Cloud SQL](https://cloud.google.com/sql/docs/postgres/connect-run)

### Conceitos principais

- Imagem Docker pronta para produção
- `Dockerfile` multi-stage
- Mínimo `cpu`, `memory`, `concurrency`
- Cold start

---

## Etapa 4: Validação e Observabilidade

- [Cloud Logging: Documentação](https://cloud.google.com/logging/docs)
- [Cloud Monitoring: Documentação](https://cloud.google.com/monitoring/docs)

### Conceitos principais

- Logs estruturados (JSON, não `console.log` solto)
- Healthcheck endpoint (`GET /health`)
- Alertas básicos (latência, erros 5xx, uso de DB)

---

## Etapa 5: Segurança DevOps

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Google Cloud: IAM básico](https://cloud.google.com/iam/docs/overview)

### Boas práticas do projeto

- Nunca commit de `.env`
- Secrets via Secret Manager (não env vars em texto)
- Service accounts com privilégio mínimo
