# Tecnologias Utilizadas

Esta seção documenta a stack do projeto explicando **o que** cada tecnologia é, **como** ela funciona no nosso contexto e **por que** foi escolhida.

A documentação está organizada por camada:

- [Frontend](frontend.md) - Next.js + TypeScript, CSS Modules
- [Backend](backend.md) - NestJS + TypeScript, TypeORM
- [Banco de Dados](banco-de-dados.md) - PostgreSQL, Docker (dev), Google Cloud SQL (prod)
- [Autenticação](autenticacao.md) - JWT, bcrypt
- [Armazenamento de Arquivos](armazenamento.md) - Google Cloud Storage
- [Testes Automatizados](testes.md) - Jest, @nestjs/testing, Supertest, React Testing Library, Playwright

---

## Resumo da Stack

| Camada          | Tecnologia                                | Versão |
| --------------- | ----------------------------------------- | ------ |
| Frontend        | Next.js + TypeScript                      | 16.x   |
| Estilização     | CSS Modules                               | -      |
| Backend         | NestJS + TypeScript                       | 11.x   |
| ORM             | TypeORM                                   | 1.x    |
| Banco (dev)     | PostgreSQL via Docker                     | 16     |
| Banco (prod)    | Google Cloud SQL (PostgreSQL)             | 16     |
| Autenticação    | JWT + bcrypt                              | -      |
| Storage         | Google Cloud Storage                      | -      |
| Containerização | Docker + Docker Compose                   | -      |
| Deploy          | Google Cloud Run                          | -      |
| Testes back     | Jest + @nestjs/testing + Supertest        | -      |
| Testes front    | Jest + React Testing Library + Playwright | -      |
