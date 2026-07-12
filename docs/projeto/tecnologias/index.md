# Tecnologias Utilizadas

Esta seção documenta a stack do projeto explicando **o que** cada tecnologia é, **como** ela funciona no nosso contexto e **por que** foi escolhida.

A documentação está organizada por camada:

- [Frontend](frontend.md): Next.js 16, React 19, TypeScript, CSS Modules, Tailwind CSS, SweetAlert2
- [Backend](backend.md): NestJS 11, TypeScript, TypeORM, Swagger, Multer
- [Banco de Dados](banco-de-dados.md): PostgreSQL, Docker (dev), Google Cloud SQL (prod), migrations
- [Autenticação](autenticacao.md): JWT, bcrypt, cookies httpOnly
- [Armazenamento de Arquivos](armazenamento.md): driver local (dev) e Google Cloud Storage (prod)
- [Testes Automatizados](testes.md): Jest, @nestjs/testing, Supertest, React Testing Library

---

## Resumo da Stack

| Camada             | Tecnologia                                                    | Versão |
| ------------------ | ------------------------------------------------------------- | ------ |
| Frontend           | Next.js + React + TypeScript                                  | 16 / 19|
| Estilização        | CSS Modules + Tailwind CSS                                    | 4      |
| Feedback UI        | SweetAlert2                                                   | 11     |
| Backend            | NestJS + TypeScript                                           | 11     |
| ORM                | TypeORM                                                       | 0.3    |
| Upload             | Multer (`@nestjs/platform-express`)                           | 2      |
| Documentação API   | Swagger (`@nestjs/swagger`)                                   | 11     |
| Banco (dev)        | PostgreSQL via Docker                                         | 16     |
| Banco (prod)       | Google Cloud SQL (PostgreSQL)                                 | 16     |
| Autenticação       | JWT + bcrypt + cookies httpOnly                               | -      |
| Storage            | Driver local (dev) e Google Cloud Storage (prod)              | -      |
| Containerização    | Docker + Docker Compose                                       | -      |
| Deploy             | Google Cloud Run + Cloud Run Jobs (migrations)                | -      |
| CI/CD              | Google Cloud Build                                            | -      |
| Segurança e deps   | Husky, lint-staged, Dependabot, CodeQL                        | -      |
| Testes backend     | Jest + @nestjs/testing + Supertest                            | -      |
| Testes frontend    | Jest + React Testing Library + user-event                     | -      |
