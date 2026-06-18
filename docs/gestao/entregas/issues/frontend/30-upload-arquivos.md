# Issue #30 - Tela de upload de arquivos

**Tipo:** Frontend

**Status:** Em andamento

**Responsáveis:** [Luiza de Melo](https://github.com/LuizaCarvalho691), [Lucas de Paula](https://github.com/lucaspaulaleal), [Gabriel Robson](https://github.com/Gabrielxcx)

**Depende de:** #28

---

## Descrição

Como médico, quero ter uma tela com formulário de upload para enviar arquivos médicos de pacientes vinculados a mim.

## Tarefas

- [ ] Criar página `/medico/arquivos/upload` no App Router
- [ ] Criar service `arquivos.service.ts` para chamada HTTP
- [ ] Criar DTOs de request e response em `dto/`
- [ ] Implementar input de seleção de arquivo (drag and drop opcional)
- [ ] Implementar dropdown de seleção do paciente vinculado
- [ ] Validar formato e tamanho do arquivo no frontend antes do envio
- [ ] Tratar estados de loading, sucesso e erro
- [ ] Estilizar com CSS Modules seguindo identidade visual

## Critérios de Aceitação

- Página acessível apenas para usuários do tipo MEDICO.
- Validação no frontend rejeita formato inválido e arquivos acima de 10 MB antes do envio.
- Página chama o service, nunca faz `fetch` direto.
- Exibe mensagem de erro clara e mensagem de sucesso após upload.
- Botão de upload desabilitado durante o envio.

## Critérios de Teste

- React Testing Library: mensagem de erro aparece quando arquivo de formato inválido é selecionado.
