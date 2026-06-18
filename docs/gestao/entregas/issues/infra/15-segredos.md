# Issue #15 - Configurar gerenciamento de segredos e variáveis de ambiente

**Tipo:** Infra

**Status:** Concluída

**Responsável:** [Hugo Rosa](https://github.com/HugoRosa29)

---

## Descrição

Como sistema, preciso armazenar credenciais de forma segura para evitar exposição de dados sensíveis.

## Tarefas

- [x] Configurar Secret Manager
- [x] Armazenar credenciais do banco
- [x] Armazenar chave JWT
- [x] Armazenar credenciais do Google Cloud Storage
- [x] Documentar procedimento de utilização

## Critérios de Aceitação

- Nenhuma credencial armazenada no código-fonte.
- Aplicação lê segredos diretamente do ambiente configurado.
- Processo documentado.

## Critérios de Teste

- Validar leitura dos segredos pela aplicação.
- Validar funcionamento após rotação de uma credencial.
