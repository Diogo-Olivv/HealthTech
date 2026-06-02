# Arquitetura do Projeto

## Visão Geral

O projeto é organizado como um **monorepo**: um único repositório Git contendo o frontend e o backend em pastas separadas. Essa escolha simplifica o desenvolvimento para times pequenos, não é necessário sincronizar dois repositórios diferentes para uma única mudança.

```
HealthTech/
├── backend/           -> API (NestJS)
├── frontend/          -> Interface web (Next.js)
├── docker-compose.yml -> Banco de Dados
├── LICENSE
└── README.md
```

---

## Separação de responsabilidades

O sistema é dividido em três camadas independentes que se comunicam de forma bidirecional. O diagrama abaixo mostra o fluxo completo de uma requisição, desde a interface do usuário até a persistência no banco de dados, incluindo a ramificação entre ambiente de desenvolvimento (Docker local) e produção (Google Cloud).

![Arquitetura do projeto](../../assets/diagramas/arquitetura.jpg)

> **Figura 1** - Fluxo de dados e infraestrutura do projeto.

### Como ler o diagrama

| Cor        | Camada    | Responsabilidade                        |
| ---------- | --------- | --------------------------------------- |
| 🔵 Azul    | Frontend  | Interface, chamadas HTTP, tipagem (DTO) |
| 🟢 Verde   | Backend   | Controllers, regras de negócio, ORM     |
| 🟣 Roxo    | Produção  | Google Cloud (Cloud Run + Cloud SQL)    |
| 🟡 Amarelo | Dev local | Docker Compose + Adminer                |

### Fluxo principal

1. `app/páginas` chama `services/HTTP`
2. `services/HTTP` envia REST para os `controllers/` do backend
3. `controllers/` delega para `services/` (cuida das regras de negócio)
4. `services/` usa `TypeORM Repository` padronizado por `entities/`
5. Repository persiste no **Banco de Dados**

### Ambiente de Desenvolvimento

- **Local:** Docker Compose com Adminer (`localhost:8080`) para visualização rápida
- **Produção:** Google Cloud SQL. O backend é hospedado no **Cloud Run** (Google Cloud).

### Observações sobre DTOs e Entities

- **DTOs:** Data Transfer Object. Evita passar múltiplos campos soltos nas requisições de um service. Por exemplo: em vez de passar "nome, e-mail, senha" separadamente, passamos um objeto `Usuario` que contém esses atributos.
- **Entities (Models):** São as entidades da aplicação (Usuários, Logs, Arquivos) estruturadas com os campos necessários para persistência no banco de dados. Garantem consistência nas operações e evitam o envio de múltiplos campos avulsos.

---

## Documentação por camada

- [Frontend](frontend.md) - Estrutura de pastas, fluxo de cadastro, service pattern
- [Backend](backend.md) - Módulos NestJS, fluxo de requisição, regras de segurança
- [Banco de Dados](banco-de-dados.md) - Entidade User, Docker, Google Cloud SQL, Adminer
