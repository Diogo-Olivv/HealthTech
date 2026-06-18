# Cronograma

Este documento detalha o planejamento, as etapas de desenvolvimento e as entregas para o **Ciclo 1** do Projeto Aplicado. O objetivo é a construção e implantação de uma aplicação web robusta na infraestrutura do Google Cloud.

- Clique [aqui](../assets/ciclo_01.pdf) para acessar o PDF do Ciclo 1, incluindo o cronograma da Fase 2 do projeto aplicado.

## 📅 Cronograma Semanal e Entregas

| Semana | Foco                       | Entrega Esperada                                 |
| ------ | -------------------------- | ------------------------------------------------ |
| **7**  | Planejamento e Arquitetura | Documento de arquitetura e Roadmap técnico       |
| **8**  | Estrutura Inicial          | Aplicação rodando localmente com estrutura base  |
| **9**  | Autenticação e Acesso      | Usuário autenticado acessando rotas protegidas   |
| **10** | Upload e Listagem          | Upload funcional e listagem filtrada por usuário |
| **11** | Storage e Persistência     | Integração com GCS e banco de dados sincronizado |
| **12** | Logging e Auditoria        | Sistema de logs persistido e consultável         |
| **13** | Deploy (Google Cloud)      | URL pública funcional (Cloud Run/App Engine)     |
| **14** | Demonstração Final         | Apresentação do projeto e da arquitetura         |

---

## Detalhamento das Fases

### Semana 7: Planejamento

- **Formação de Grupos:** Grupos de 5 alunos.
- **Papéis:** Definição de Líder Técnico, Backend, Frontend, DevOps e Documentação/Logs.
- **Arquitetura:** Criação do diagrama de arquitetura, escolha do _stack_ tecnológico e inicialização do repositório.

### Semana 8: Estrutura Inicial

- Setup completo do ambiente de desenvolvimento (Backend/Frontend).
- Configuração do banco de dados e padronização da estrutura do projeto.

### Semana 9: Autenticação e Controle de Acesso

- Implementação de Cadastro e Login.
- Segurança: Hashing de senhas (ex: `bcrypt`) e implementação de autenticação via **JWT** ou sessão segura.

### Semana 10: Upload e Listagem

- Desenvolvimento das rotas de upload de arquivos.
- Garantia de isolamento: Associação estrita do arquivo ao ID do usuário autenticado.

### Semana 11: Storage e Persistência

- Integração com **Google Cloud Storage (GCS)** para armazenamento de arquivos.
- Sincronização dos metadados dos arquivos com o banco de dados.

### Semana 12: Logging e Auditoria

- Implementação de logs de eventos: Login, Logout, Upload, Download, Exclusão e tentativas de acesso inválidas.
- **Estrutura do Log:** Timestamp, ID do usuário, Tipo do evento e Status.

### Semana 13: Deploy em Google Cloud

- Publicação da aplicação via **Cloud Run** ou **App Engine**.
- Utilização de serviços gerenciados: **Cloud SQL** ou **Firestore** para persistência.

### Semana 14: Demonstração Final

- Apresentação técnica focada em: Arquitetura, Código, Demonstração do fluxo completo, Sistema de Logs e Segurança aplicada.

---

## Requisitos Funcionais da Aplicação

- Cadastro
- Login
- Upload
- Listagem
- Download
- Exclusão

## Requisitos Não Funcionais

- Segurança
- Hash de senha
- Isolamento por usuário
- Rotas protegidas
- Logging
- Eventos auditáveis e persistidos.
- Disponibilidade
- Implantação em Google Cloud obrigatória 9. Critérios de Avaliação
