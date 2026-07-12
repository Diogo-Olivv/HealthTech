# HealthTech

Plataforma SaaS para clínicas e profissionais de saúde independentes. Médicos fazem upload de documentos e exames, e pacientes acessam seus arquivos com segurança por meio de vínculos médico-paciente controlados e auditáveis.

**Contexto:** projeto de extensão da UnB (FCTE), ministrado pelo Prof. Nilton e pelo Prof. Fabrício, no laboratório AILAB Makers. Ciclo 2 com duração de 8 semanas (Semanas 7 a 14). Leia o documento completo da [Fase 2](assets/Fase2.pdf) antes de iniciar.

---

## Stack

| Área            | Tecnologias                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| Frontend        | Next.js 16, React 19, TypeScript, CSS Modules, Tailwind CSS 4, SweetAlert2      |
| Backend         | NestJS 11, TypeScript, TypeORM, JWT, bcrypt, Multer, Swagger                    |
| Banco de Dados  | PostgreSQL 16 (Docker no ambiente local, Cloud SQL em produção)                 |
| Infraestrutura  | Google Cloud Run, Cloud Storage, Cloud SQL, Secret Manager, Cloud Build         |
| Qualidade       | Husky + lint-staged, ESLint, Prettier, Dependabot, CodeQL                       |
| Testes          | Jest, Supertest, @nestjs/testing, React Testing Library                         |

---

## Por onde começar?

<div class="nav-cards">
  <a class="nav-card" href="projeto/tecnologias/">
    <strong>Projeto</strong>
    <span>Identidade visual, tecnologias e modelagem</span>
  </a>
  <a class="nav-card" href="arquitetura/">
    <strong>Arquitetura</strong>
    <span>Backend, frontend, banco de dados e infraestrutura</span>
  </a>
  <a class="nav-card" href="desenvolvimento/setup/">
    <strong>Desenvolvimento</strong>
    <span>Setup, padrões de trabalho e ADRs</span>
  </a>
  <a class="nav-card" href="gestao/cronograma/">
    <strong>Gestão</strong>
    <span>Cronograma, atas de reunião e entregas semanais</span>
  </a>
</div>

---

## Equipe

Seis integrantes sem papel fixo. A cada semana, cada pessoa escolhe as issues que vai desenvolver e registra suas contribuições via commits e PRs vinculados à issue correspondente.

<div class="team-grid">
  <a class="team-member" href="https://github.com/Diogo-Olivv" target="_blank" rel="noopener">
    <img src="https://github.com/Diogo-Olivv.png?size=200" alt="Diogo" />
    <span>Diogo</span>
  </a>
  <a class="team-member" href="https://github.com/HugoRosa29" target="_blank" rel="noopener">
    <img src="https://github.com/HugoRosa29.png?size=200" alt="Hugo" />
    <span>Hugo</span>
  </a>
  <a class="team-member" href="https://github.com/MartinQMelo" target="_blank" rel="noopener">
    <img src="https://github.com/MartinQMelo.png?size=200" alt="Martin" />
    <span>Martin</span>
  </a>
  <a class="team-member" href="https://github.com/lucaspaulaleal" target="_blank" rel="noopener">
    <img src="https://github.com/lucaspaulaleal.png?size=200" alt="Lucas" />
    <span>Lucas</span>
  </a>
  <a class="team-member" href="https://github.com/LuizaCarvalho691" target="_blank" rel="noopener">
    <img src="https://github.com/LuizaCarvalho691.png?size=200" alt="Luíza" />
    <span>Luíza</span>
  </a>
  <a class="team-member" href="https://github.com/Gabrielxcx" target="_blank" rel="noopener">
    <img src="https://github.com/Gabrielxcx.png?size=200" alt="Gabriel" />
    <span>Gabriel</span>
  </a>
</div>

> A rastreabilidade das contribuições individuais é feita pelo histórico de commits e PRs, não por papéis predefinidos.

---

## Timeline

| Semana    | Fase                | Entregáveis principais                                                          |
| --------- | ------------------- | ------------------------------------------------------------------------------- |
| **7**     | Arquitetura e Setup | Diagrama de arquitetura, ADRs iniciais, Docker funcional, CI/CD básico          |
| **8 a 12**| Desenvolvimento     | Features iterativas: auth, upload, GCS, isolamento por usuário e auditoria      |
| **13 e 14**| Deploy e Demo      | URL pública no Cloud Run, painel de admin, apresentação final                   |

> Detalhamento semana a semana em [Cronograma](gestao/cronograma.md).

---

## Padrões de Trabalho

| Área             | Documento                                                                     |
| ---------------- | ----------------------------------------------------------------------------- |
| Git e branches   | [Commits e Branches](desenvolvimento/padroes/git.md)                          |
| Padrão de código | [Padrões de Código](desenvolvimento/padroes/codigo.md)                        |
| Code review      | [Fluxo de Code Review](desenvolvimento/padroes/review.md)                     |
| Template de PR   | [Template do Pull Request](desenvolvimento/padroes/template_PR.md)            |
| Templates de issue | [Templates de Issue](desenvolvimento/padroes/templates_issues.md)           |
| Decisões técnicas | [Índice de ADRs](desenvolvimento/adr/index.md)                               |

---

> O objetivo não é apenas entregar uma aplicação, mas praticar uma rotina profissional de desenvolvimento em equipe.
