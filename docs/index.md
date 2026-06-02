# HealthTech - Documentação Geral

Plataforma SaaS para clínicas e profissionais de saúde independentes, onde pacientes e médicos gerenciam resultados de exames e documentos médicos com segurança.

**Contexto:** Projeto de extensão da UnB (FCTE), ministrado pelo Prof. Nilton. Ciclo 1 com duração de 7 semanas (Semanas 7-14). Leia o documento completo da [Fase 2](assets/Fase2.pdf) antes de iniciar.

---

## 1. Requisitos do Projeto

A aplicação é tratada como MVP comercial (SaaS) com os seguintes requisitos obrigatórios:

- **Autenticação:** Login e cadastro com hashing de senhas e JWT (ou sessões seguras).
- **Gerenciamento de arquivos:** Upload, listagem, download e exclusão integrados ao Google Cloud Storage (GCS).
- **Isolamento de dados:** Documentos associados estritamente ao usuário autenticado que os enviou.
- **Auditoria:** Logs persistidos de Login, Logout, Upload, Download, Exclusão e acessos inválidos - com `timestamp`, `user_id`, `tipo_evento` e `status`.
- **Infraestrutura:** Deploy no Cloud Run ou App Engine; banco de dados no Cloud SQL ou Firestore.

---

## 2. Equipe

6 integrantes divididos em dois perfis com responsabilidades distintas:

| Perfil         | Foco principal                                                     |
| -------------- | ------------------------------------------------------------------ |
| **Júnior (3)** | Backend & Frontend - com exposição gradual a DevOps e Documentação |
| **Sênior (3)** | DevOps & Cloud, Documentação & Logs e Guia Técnico dos Júniors     |

A rotação das duplas ocorre a cada 2 semanas, em 3 ciclos (Semanas 8-13). Cada dupla é formada por 1 Sênior + 1 Júnior.

> Papéis detalhados, nomes e cronograma de rotação em [Rotatividade de Duplas](rotacoes/index.md)

---

## 3. Padrões de Trabalho

A documentação é mantida via MkDocs com tema Material, hospedada no GitHub Pages (branch `gh-pages`).

| Área             | Documento                                          |
| ---------------- | -------------------------------------------------- |
| Git e branches   | [Commits e Branches](padroes/git.md)               |
| Padrão de código | [Padrões de Código](padroes/codigo.md)             |
| Code review      | [Fluxo de Code Review](padroes/review.md)          |
| Template de PR   | [Template do Pull Request](padroes/template_PR.md) |

---

## 4. Fases e Timeline

| Semana    | Fase                | Entregáveis principais                                        |
| --------- | ------------------- | ------------------------------------------------------------- |
| **7**     | Arquitetura & Setup | Diagrama de arquitetura, ADRs, Docker funcional, CI/CD básico |
| **8-12**  | Desenvolvimento     | Features iterativas: auth, upload, GCS, isolamento e logs     |
| **13-14** | Deploy & Demo       | URL pública no Cloud Run/App Engine e apresentação final      |

> Detalhamento semana a semana em [Cronograma Fase 2](cronograma_fase2.md)

**Fluxo por feature (Fase 2):**

1. Júnior abre branch seguindo os [padrões de Git](padroes/git.md)
2. Implementa com pair programming (opcional) com o Sênior
3. Abre PR, o Sênior revisa e faz o merge na `main`
4. Júnior atualiza a documentação da feature no MkDocs

**Dedicação esperada:** 10h semanais por integrante.

---

## 5. Metodologia de Desenvolvimento - Scrum Adaptado

- **Sprint semanal:** Backlog priorizado com duração de 1 semana
- **2 reuniões na semana:** Registrar cada reunião seguindo um padrão de [ata](atas_e_checklists/atas_reuniao/template_ata.md) na documentação.
- **Retrospectiva (A ser definida):** 15 min (o que funcionou / impedimentos / próximas tarefas)
- **Relatório STAR:** ao fim de cada ciclo de 2 semanas ([ver template](rotacoes/template_relatorio.md))
- **Checklist Semana do Integrante:** [Checklist Template](atas_e_checklists/checklist_semanal/template.md)

---

## 6. Regras

### Penalidades

| Situação                           | Consequência                 |
| ---------------------------------- | ---------------------------- |
| Falta presencial sem justificativa | Advertência de falta         |
| 3 advertências de falta            | Desligamento                 |
| 2 semanas sem commits              | Advertência de produtividade |
| 2 advertências de produtividade    | Desligamento                 |
| Plágio                             | Desligamento imediato        |
| Entrega com atraso não justificado | Desconto na nota             |

### Laboratório

- Não trazer pessoas de fora do projeto.
- Manter o laboratório organizado; desligar tudo ao sair por último.
- Evitar uso às quartas-feiras das 14h30 às 15h.
- PRs são o principal critério de avaliação - mantê-los atualizados e sem conflitos é responsabilidade de cada grupo.

---

> O objetivo não é apenas entregar uma aplicação, mas praticar uma rotina profissional de desenvolvimento em equipe.
