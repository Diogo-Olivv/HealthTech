# Gabriel - Isolamento de Dados

---

## Persona: Marina Fonseca

**Perfil:** Médica clínica geral, 34 anos, Brasília - DF.  
Atende em clínica particular e pelo plano de saúde. Usa prontuário eletrônico no dia a dia e tem familiaridade intermediária com tecnologia.

**Contexto de uso:**  
Faz upload dos laudos e resultados dos seus pacientes na plataforma para acessar remotamente durante consultas. Já teve susto com outro sistema que exibiu documentos de um paciente incorreto.

**Objetivo principal:**  
Acessar *apenas* os documentos dos seus próprios pacientes, sem risco de ver ou ser vista por outros profissionais.

**Frustrações e medos:**
- Vazar dados de paciente por descuido do sistema
- Ter documentos acessados por um colega sem autorização
- Sofrer multa por violação da LGPD
- Perder a confiança do paciente

**Citação representativa:**  
> "Eu preciso ter certeza de que o que eu envio fica só comigo. Meu paciente me confiou aquilo."

---

## ISO-01: Acesso restrito ao próprio acervo de documentos

### Descrição:
Como médica autenticada, quero que a listagem de arquivos exiba somente os documentos que eu mesma fiz upload, para que eu nunca veja dados de outros usuários.

### Critérios de Aceitação:
- A query ao banco sempre filtra por `user_id` extraído do token JWT vigente.
- Nenhum documento de outro usuário aparece na resposta, mesmo que o ID seja fornecido via URL.
- Testes automatizados validam que o usuário B não consegue ver arquivos do usuário A.

---

## ISO-02: Bloqueio de download de documento alheio por URL direta

### Descrição:
Como sistema, quero rejeitar requisições de download de arquivos que não pertençam ao usuário autenticado, mesmo que ele possua a URL ou o ID do arquivo.

### Critérios de Aceitação:
- O endpoint de download valida `owner_id == user_id` antes de gerar a URL assinada no GCS.
- Retorna `403 Forbidden` com mensagem genérica, sem revelar se o arquivo existe.
- O evento de acesso inválido é registrado no log de auditoria.

---

## ISO-03: Bloqueio de exclusão de documento alheio

### Descrição:
Como médica, quero ter a garantia de que nenhum outro usuário da plataforma pode apagar meus documentos, por mais que tente adivinhar o ID.

### Critérios de Aceitação:
- O endpoint de exclusão verifica a propriedade do arquivo antes de qualquer operação no GCS.
- Retorna `403` se o `user_id` do token não coincide com o dono do arquivo.
- Nenhuma exclusão parcial ocorre - a operação é atômica (banco + GCS juntos ou nenhum).

---

## ISO-04: Associação automática de arquivo ao usuário no upload

### Descrição:
Como sistema, quero que ao receber um upload o `user_id` seja extraído do JWT e gravado no banco automaticamente, sem depender de nenhum campo enviado pelo cliente.

### Critérios de Aceitação:
- O campo `owner_id` no banco é preenchido exclusivamente pelo backend com o `sub` do token JWT.
- Qualquer tentativa de forçar outro `owner_id` via body da requisição é ignorada.
- O arquivo é salvo no GCS em um path segregado por usuário: `{user_id}/{filename}`.

---

## ISO-05: Isolamento verificado por testes de integração

### Descrição:
Como time de desenvolvimento, quero uma suíte de testes que simule dois usuários distintos e verifique o isolamento em todos os endpoints, para garantir que nenhuma regressão quebre essa proteção.

### Critérios de Aceitação:
- Cobertura mínima de: listagem, download e exclusão com tokens de usuários diferentes.
- Os testes rodam no CI a cada PR e falham em caso de qualquer violação de isolamento.
- O resultado dos testes é documentado no relatório do PR.

---

## ISO-06: Erro amigável ao tentar acessar documento sem permissão

### Descrição:
Como médica, quero receber uma mensagem clara mas sem detalhes técnicos quando tentar acessar um recurso ao qual não tenho permissão, para não ficar confusa nem expor informações internas do sistema.

### Critérios de Aceitação:
- A resposta de erro não distingue entre "arquivo não existe" e "arquivo pertence a outro usuário".
- Mensagem exibida na interface: `"Documento não encontrado ou sem permissão."`
- Código HTTP `403` em ambos os casos (não `404`).
