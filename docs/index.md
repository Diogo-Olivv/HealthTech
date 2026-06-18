# HealthTech

Plataforma SaaS para clínicas e profissionais de saúde independentes, onde médicos fazem upload de documentos e exames, e pacientes acessam seus arquivos com segurança através de vínculos médico-paciente controlados.

**Contexto:** Projeto de extensão da UnB (FCTE), ministrado pelo Prof. Nilton. Ciclo 2 com duração de 8 semanas (Semanas 7–14). Leia o documento completo da [Fase 2](assets/Fase2.pdf) antes de iniciar.

---

## Stack

| Área            | Tecnologias                                                  |
| --------------- | ------------------------------------------------------------ |
| Frontend        | Next.js 16, TypeScript, CSS Modules                          |
| Backend         | NestJS 11, TypeScript, TypeORM, JWT + bcrypt                 |
| Banco de Dados  | PostgreSQL 16 · Docker (dev) · Cloud SQL (prod)              |
| Infraestrutura  | Google Cloud Run, Cloud Storage, Secret Manager              |
| Testes          | Jest, Supertest, React Testing Library, Playwright           |

---

## Por onde começar?

<div class="nav-cards">
  <a class="nav-card" href="projeto/tecnologias/">
    <strong>Projeto</strong>
    <span>Identidade visual, tecnologias e modelagem</span>
  </a>
  <a class="nav-card" href="desenvolvimento/arquitetura/">
    <strong>Desenvolvimento</strong>
    <span>Arquitetura, infra, padrões e roadmap</span>
  </a>
  <a class="nav-card" href="gestao/cronograma/">
    <strong>Gestão</strong>
    <span>Cronograma, atas de reunião e entregas</span>
  </a>
</div>

---

## Equipe

6 integrantes sem papel fixo. A cada semana, cada pessoa escolhe as issues que vai desenvolver e registra suas contribuições via commits e PRs vinculados à issue correspondente.

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

| Semana    | Fase                | Entregáveis principais                                        |
| --------- | ------------------- | ------------------------------------------------------------- |
| **7**     | Arquitetura & Setup | Diagrama de arquitetura, ADRs, Docker funcional, CI/CD básico |
| **8–12**  | Desenvolvimento     | Features iterativas: auth, upload, GCS, isolamento e logs     |
| **13–14** | Deploy & Demo       | URL pública no Cloud Run e apresentação final                 |

> Detalhamento semana a semana em [Cronograma](gestao/cronograma.md)

---

## Padrões de Trabalho

| Área             | Documento                                                           |
| ---------------- | ------------------------------------------------------------------- |
| Git e branches   | [Commits e Branches](desenvolvimento/padroes/git.md)               |
| Padrão de código | [Padrões de Código](desenvolvimento/padroes/codigo.md)             |
| Code review      | [Fluxo de Code Review](desenvolvimento/padroes/review.md)          |
| Template de PR   | [Template do Pull Request](desenvolvimento/padroes/template_PR.md) |

---

> O objetivo não é apenas entregar uma aplicação, mas praticar uma rotina profissional de desenvolvimento em equipe.
