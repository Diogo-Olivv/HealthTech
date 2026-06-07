# Arquitetura de Infraestrutura — MVP HealthTech

> **Status:** Proposta para aprovação do time
> **Plataforma:** Google Cloud Platform (GCP)
> **Modelo:** SaaS
> **Issue de referência:** 

---

## 1. Visão Geral

O MVP do HealthTech será implantado inteiramente na Google Cloud Platform, utilizando serviços gerenciados para minimizar overhead operacional e permitir que a equipe foque no desenvolvimento do produto. A arquitetura segue o modelo de contêineres sem servidor (*serverless containers*) com escalabilidade automática.

A aplicação é uma plataforma SaaS voltada a clínicas de saúde e profissionais autônomos, e todos os dados são tratados como dados sensíveis nos termos da LGPD (Lei 13.709/2018).

---

## 2. Componentes da Arquitetura

### 2.1 Hospedagem — Cloud Run

| Serviço       | Tecnologia             | Descrição                                               |
|---------------|------------------------|---------------------------------------------------------|
| **Frontend**  | Next.js (TypeScript)   | Aplicação React containerizada, App Router              |
| **Backend**   | NestJS (TypeScript)    | API REST — módulos, controllers, services, TypeORM      |
| **Worker**    | NestJS (job queue)     | Processamento assíncrono de tarefas (notificações, relatórios) |

**Justificativa:**
O Cloud Run executa contêineres sob demanda sem necessidade de gerenciar infraestrutura de servidores. O modelo *pay-per-request* é ideal para um MVP com tráfego imprevisível. O escalonamento automático (incluindo *scale-to-zero*) reduz custo em períodos de baixo uso.

**Configuração mínima recomendada:**

| Serviço   | Memória    | Concorrência       | Região                 |
|-----------|------------|--------------------|------------------------|
| Frontend  | 256 MB     | 80 req/instância   | `southamerica-east1`   |
| Backend   | 512 MB     | 80 req/instância   | `southamerica-east1`   |
| Worker    | 512 MB     | 10 req/instância   | `southamerica-east1`   |

A região `southamerica-east1` (São Paulo) garante conformidade com a LGPD e menor latência para usuários brasileiros.

---

### 2.2 Banco de Dados — Cloud SQL (PostgreSQL)

**Justificativa:**
O Cloud SQL com PostgreSQL oferece um banco de dados relacional totalmente gerenciado, com backups automáticos, replicação e alta disponibilidade. PostgreSQL é a escolha padrão da indústria para dados de saúde, por sua robustez com dados estruturados, suporte a JSONB e maturidade do ecossistema. O TypeORM (ORM do NestJS) tem integração nativa com PostgreSQL, permitindo usar `synchronize: true` em desenvolvimento e *migrations* em produção sem mudança de código.

**Configuração:**

| Parâmetro        | Valor                              |
|------------------|------------------------------------|
| Instância        | `db-f1-micro` (MVP, escalonável)   |
| Versão           | PostgreSQL 16                      |
| Localização      | `southamerica-east1`               |
| Acesso           | VPC privada (Cloud SQL Auth Proxy) |
| Backups          | Automáticos, retenção 7 dias       |
| Criptografia     | Em repouso, habilitada por padrão  |

O acesso é feito via **Cloud SQL Auth Proxy** dentro de uma VPC privada — sem IP público exposto.

---

### 2.3 Armazenamento de Arquivos — Google Cloud Storage (GCS)

**Justificativa:**
O GCS fornece armazenamento de objetos escalável e durável (99,999999999% de durabilidade). É a solução nativa para armazenar arquivos como exames, laudos e documentos enviados por usuários, sem impactar o banco de dados relacional. Os arquivos nunca são servidos diretamente ao público — o acesso é controlado pelo backend via Signed URLs com expiração configurável.

**Estratégia de organização dos buckets:**

```
healthtech-mvp-uploads/
  ├── exames/{user_id}/{timestamp}_{filename}
  ├── laudos/{user_id}/{timestamp}_{filename}
  └── avatares/{user_id}/profile.jpg
```

**Configuração:**

| Parâmetro            | Valor                                             |
|----------------------|---------------------------------------------------|
| Região do bucket     | `southamerica-east1`                              |
| Controle de acesso   | Uniform bucket-level access (IAM), sem ACLs       |
| Acesso público       | Desabilitado — servido via Signed URLs com expiração |
| Classe ativa         | `STANDARD`                                        |
| Ciclo de vida        | Migrar para `NEARLINE` após 90 dias de inatividade |
| Criptografia         | Chaves gerenciadas pelo Google (CMEK opcional depois) |

---

### 2.4 Autenticação — Firebase Authentication

**Justificativa:**
O Firebase Auth oferece autenticação pronta para uso com suporte a e-mail/senha, OAuth (Google) e tokens JWT. Integra-se nativamente com os serviços GCP e evita a necessidade de implementar e manter lógica de autenticação do zero no MVP. No backend NestJS, o token é validado via Firebase Admin SDK em cada requisição.

**Fluxo de autenticação:**

```
Usuário (browser)
  │── [1] POST /auth/login (email + senha) ──▶ Firebase Auth
  │◀── [2] JWT assinado ──────────────────────
  │── [3] Requisições com Bearer Token ──▶ Backend NestJS
                                            │── [4] Valida JWT (Firebase Admin SDK)
                                            │── [5] Extrai claims (role, user_id)
                                            └── [6] Autoriza ou rejeita (403)
```

**Roles gerenciados via claims do JWT:**

| Role       | Permissões                                  |
|------------|---------------------------------------------|
| `paciente` | Upload/download/exclusão dos próprios arquivos |
| `medico`   | Acesso a arquivos dos pacientes associados  |
| `admin`    | Acesso administrativo completo              |

---

### 2.5 Gerenciamento de Segredos — Secret Manager

**Justificativa:**
O Secret Manager armazena credenciais sensíveis fora do código e das variáveis de ambiente do contêiner. O acesso é controlado por IAM e auditável via Cloud Audit Logs. Cada serviço Cloud Run recebe permissão de leitura apenas para os segredos que lhe são necessários (*Least Privilege*).

**Segredos gerenciados:**

| Segredo                     | Consumido por         |
|-----------------------------|-----------------------|
| `DATABASE_URL`              | Backend, Worker       |
| `FIREBASE_SERVICE_ACCOUNT`  | Backend               |
| `GCS_SERVICE_ACCOUNT_KEY`   | Backend               |
| `JWT_SECRET`                | Backend (token interno opcional) |
| `EMAIL_API_KEY`             | Worker                |

**Acesso:** O Cloud Run injeta os segredos como variáveis de ambiente na inicialização do contêiner — nenhuma credencial é armazenada no repositório.

---

### 2.6 CI/CD — GitHub Actions + Cloud Build

**Justificativa:**
O pipeline de CI/CD automatiza testes, build e deploy a cada push na branch `main`, garantindo que apenas código revisado e testado chegue ao ambiente de produção. A combinação de GitHub Actions (testes + lint) com Cloud Build (build da imagem Docker + deploy no Cloud Run) mantém o ecossistema GCP unificado.

**Fluxo do pipeline:**

```
Push / Merge PR → main
        │
        ▼
[ GitHub Actions ]
  ├── Lint (ESLint + Prettier)
  ├── Testes unitários (Jest)
  └── Testes de integração (Supertest)
        │
        ▼ (apenas se testes passarem)
[ Cloud Build ]
  ├── Build da imagem Docker
  ├── Push para Artifact Registry
  └── Deploy no Cloud Run (backend / frontend)
```

**Ambientes:**

| Ambiente     | Branch  | Deploy automático |
|--------------|---------|-------------------|
| Produção     | `main`  | Sim               |
| Preview (PR) | Qualquer | Não (manual)     |

---

### 2.7 Monitoramento — Cloud Monitoring + Cloud Logging

**Justificativa:**
Observabilidade mínima necessária para detectar falhas, latência elevada e eventos de segurança em produção sem custo adicional no GCP.

**O que é monitorado:**

| Métrica                   | Ferramenta              |
|---------------------------|-------------------------|
| Latência de requisições   | Cloud Monitoring        |
| Uso de CPU e memória      | Cloud Monitoring        |
| Erros 5xx                 | Cloud Monitoring + Alertas |
| Logs da aplicação         | Cloud Logging           |
| Eventos de auditoria      | Cloud Audit Logs        |
| Logs de acesso a arquivos | GCS Audit Logs          |

**Eventos de auditoria da aplicação** (persistidos no banco):

| Evento           | Registrado quando                  |
|------------------|------------------------------------|
| `LOGIN_SUCCESS`  | Autenticação bem-sucedida          |
| `LOGIN_FAILURE`  | Credenciais inválidas              |
| `UPLOAD_SUCCESS` | Arquivo enviado ao GCS             |
| `DOWNLOAD_SUCCESS` | Arquivo baixado                  |
| `DELETE_SUCCESS` | Arquivo removido                   |
| `ACCESS_DENIED`  | Tentativa de acesso não autorizado |

---

## 3. Diagrama da Arquitetura

```
                        ┌─────────────────────┐
                        │  Desenvolvedor (Git) │
                        └──────────┬──────────┘
                                   │ Push / PR
                                   ▼
                        ┌─────────────────────┐
                        │    GitHub Actions    │
                        │  Lint · Test · Build │
                        └──────────┬──────────┘
                                   │ (se OK)
                                   ▼
                        ┌─────────────────────┐
                        │    Cloud Build       │
                        │  Image → Artifact    │
                        │  Registry → Cloud Run│
                        └──────────┬──────────┘
                                   │
═══════════════════════════════════╪══════════════════════════════════
                   AMBIENTE DE PRODUÇÃO (GCP)
═══════════════════════════════════╪══════════════════════════════════
                                   │
                    ┌──────────────▼──────────────┐
                    │    Usuário / Browser (HTTPS) │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  Cloud Load Balancer + CDN   │
                    │     Cloud Armor (WAF)        │
                    └──────┬───────────────────────┘
                           │
              ┌────────────▼────────────┐
              │                         │
   ┌──────────▼──────────┐   ┌─────────▼──────────┐
   │  Frontend (Cloud Run)│   │ Backend (Cloud Run) │
   │  Next.js + TypeScript│   │ NestJS REST API     │
   └─────────────────────┘   └──────┬──────────────┘
                                     │
           ┌─────────────────────────┼──────────────────────────┐
           │                         │                          │
           ▼                         ▼                          ▼
┌──────────────────┐    ┌────────────────────┐    ┌────────────────────┐
│ Firebase Auth    │    │  Cloud SQL          │    │  Cloud Storage     │
│ JWT / OAuth      │    │  PostgreSQL 16      │    │  (GCS)             │
│                  │    │  VPC privada        │    │  Arquivos / exames │
└──────────────────┘    │  Cloud SQL Proxy    │    │  Signed URLs       │
                        └────────────────────┘    └────────────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │    Secret Manager        │
                        │  Credenciais e API keys  │
                        └─────────────────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │  Cloud Monitoring        │
                        │  Cloud Logging           │
                        │  Cloud Audit Logs        │
                        └─────────────────────────┘
```

---

## 4. Decisões Técnicas — Sumário

| Componente     | Serviço GCP / Tecnologia   | Alternativa Descartada          | Razão da Escolha                                                    |
|----------------|----------------------------|---------------------------------|---------------------------------------------------------------------|
| Hospedagem     | Cloud Run                  | GKE, App Engine                 | Menor complexidade operacional; *pay-per-use* ideal para MVP        |
| Banco de dados | Cloud SQL (PostgreSQL 16)  | Firestore, BigQuery             | Dados relacionais estruturados; integração nativa TypeORM; LGPD     |
| Armazenamento  | Google Cloud Storage       | Firebase Storage                | Mais controle de acesso; Signed URLs; integração nativa GCP         |
| Autenticação   | Firebase Auth              | Auth0, implementação própria    | Integração nativa GCP; velocidade de implementação no MVP           |
| Segredos       | Secret Manager             | Variáveis de ambiente diretas   | Auditabilidade; rotação de segredos; segurança por IAM              |
| CDN / Edge     | Cloud CDN + Load Balancer  | Cloudflare                      | Ecossistema GCP unificado; Cloud Armor incluso                      |
| CI/CD          | GitHub Actions + Cloud Build | CircleCI, Jenkins             | GitHub já é o VCS do projeto; Cloud Build integra com GCP nativo    |
| Monitoramento  | Cloud Monitoring + Logging | Datadog, New Relic              | Sem custo adicional no GCP; integrado por padrão                    |
| Backend        | NestJS (TypeScript)        | Express puro, Fastify           | Arquitetura modular; integração nativa TypeORM, JWT, class-validator |
| Frontend       | Next.js (TypeScript)       | Create React App, Vite          | App Router; SSR; deploy simplificado no Cloud Run                   |

---

## 5. Conformidade e Segurança

- **LGPD:** Dados de saúde são dados sensíveis (Art. 11). A escolha de `southamerica-east1` mantém os dados em território nacional.
- **Criptografia em trânsito:** HTTPS obrigatório em todas as comunicações (TLS 1.2+). Cloud Run aplica TLS por padrão.
- **Criptografia em repouso:** Habilitada por padrão em Cloud SQL e GCS.
- **Acesso mínimo (*Least Privilege*):** Cada serviço Cloud Run recebe uma Service Account dedicada com apenas as permissões necessárias.
- **Senhas:** Hash com `bcrypt` no backend — nunca armazenadas em texto plano.
- **Isolamento de dados:** Documentos são estritamente associados ao `user_id` do token JWT autenticado. Cada acesso é validado pelo backend.
- **Arquivos privados:** Nenhum arquivo no GCS é público. O acesso é feito via Signed URLs geradas pelo backend com expiração controlada.
- **Auditoria:** Cloud Audit Logs habilitado para Secret Manager, Cloud SQL e GCS. Eventos de aplicação persistidos no banco de dados.
- **WAF:** Cloud Armor no Load Balancer para proteção contra ataques comuns (DDoS, SQLi, XSS).

---

## 6. Referências

- [Cloud Run — Documentação](https://cloud.google.com/run/docs)
- [Cloud SQL — PostgreSQL](https://cloud.google.com/sql/docs/postgres)
- [Google Cloud Storage](https://cloud.google.com/storage/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Secret Manager](https://cloud.google.com/secret-manager/docs)
- [Cloud Build — CI/CD](https://cloud.google.com/build/docs)
- [Cloud Monitoring](https://cloud.google.com/monitoring/docs)
- [NestJS — Documentação](https://docs.nestjs.com)
- [Next.js — Documentação](https://nextjs.org/docs)
- [LGPD — Lei 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
