# HealthTech

Plataforma SaaS para clínicas e profissionais de saúde independentes, onde pacientes e médicos gerenciam resultados de exames e documentos médicos com segurança.

Projeto de extensão da UnB (FCTE) - Prof. Nilton. e Prof. Fabrício

---

## Stack

| Camada    | Tecnologia                          |
| --------- | ----------------------------------- |
| Frontend  | Next.js + TypeScript + CSS Modules  |
| Backend   | NestJS + TypeScript + TypeORM       |
| Banco     | PostgreSQL (Docker local / Cloud SQL prod) |
| Deploy    | Google Cloud Run                    |

---

## Rodando localmente

**Pré-requisitos:** Node.js 20+, Docker

```bash
git clone https://github.com/Diogo-Olivv/HealthTech.git
cd HealthTech

# Banco de dados
docker compose up -d

# Backend
cd backend && npm install && npm run start:dev

# Frontend
cd frontend && npm install && npm run dev
```

Acesse em `http://localhost:3000`. Adminer (visualizador do banco) em `http://localhost:8080`.

---

## Documentação

Disponível em [GitHub Pages](https://diogo-olivv.github.io/HealthTech) ou localmente com:

```bash
pip install mkdocs-material mkdocs-awesome-pages-plugin
mkdocs serve
```
