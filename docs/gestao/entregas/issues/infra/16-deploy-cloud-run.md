# Issue #16 - Deploy inicial da aplicação no Cloud Run

**Tipo:** Infra

**Status:** Concluída

**Responsável:** [Hugo Rosa](https://github.com/HugoRosa29)

---

## Descrição

Como equipe de desenvolvimento, quero publicar a aplicação em um ambiente acessível para realizar testes integrados e disponibilizar o sistema.

## Tarefas

- [x] Criar serviço no Cloud Run
- [x] Configurar imagem Docker da aplicação
- [x] Configurar variáveis de ambiente
- [x] Integrar com banco de dados e Cloud Storage
- [x] Configurar pipeline de deploy reproduzível via `cloudbuild.yaml`

## Critérios de Aceitação

- Aplicação acessível publicamente.
- Backend conectado ao banco e ao GCS.
- Deploy reproduzível via pipeline.

## Critérios de Teste

- Requisição HTTP para endpoint de health-check.
- Validar conexão com banco.
- Validar upload de arquivo para GCS.
