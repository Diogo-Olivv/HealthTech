# Caso de teste manual — fluxo de arquivos

Base URL: `http://localhost:3001`
Pré-requisitos:
- `docker compose up -d postgres`
- `cd backend && npm run start:dev`
- Variáveis de ambiente do GCS configuradas (`GCS_BUCKET_NAME`, credenciais). Sem isso o passo 7 (upload) vai falhar com 500.

> Dica: no Postman/Bruno, crie um *Environment* com as variáveis `{{baseUrl}} = http://localhost:3001`, `{{medicoToken}}`, `{{pacienteToken}}`, `{{pacienteId}}`. Os passos abaixo populam essas variáveis.

---

## 1. Health check (sanidade)

`GET {{baseUrl}}/health`

**Esperado:** `200 OK` com `{ "status": "ok", ... }`.

---

## 2. Registrar paciente

`POST {{baseUrl}}/users/pacientes`

Headers:
```
Content-Type: application/json
```

Body (JSON):
```json
{
  "name": "Joana Paciente",
  "email": "joana.paciente@test.com",
  "password": "senha12345",
  "cpf": "39053344705",
  "dataNascimento": "1995-04-10"
}
```

**Esperado:** `201 Created`. Salve `id` em `{{pacienteId}}`.

> O CPF acima é válido pelo dígito verificador. Para gerar outros, use https://www.4devs.com.br/gerador_de_cpf.

---

## 3. Registrar médico

`POST {{baseUrl}}/users/medicos`

Headers:
```
Content-Type: application/json
```

Body (JSON):
```json
{
  "name": "Dr. Carlos Médico",
  "email": "carlos.medico@test.com",
  "password": "senha12345",
  "crm": "CRM-SP/123456",
  "especialidade": "Cardiologia"
}
```

**Esperado:** `201 Created`.

---

## 4. Login do médico

`POST {{baseUrl}}/users/login`

Body:
```json
{
  "email": "carlos.medico@test.com",
  "password": "senha12345"
}
```

**Esperado:** `200 OK` com `{ "accessToken": "..." }`. Salve em `{{medicoToken}}`.

---

## 5. Login do paciente

`POST {{baseUrl}}/users/login`

Body:
```json
{
  "email": "joana.paciente@test.com",
  "password": "senha12345"
}
```

**Esperado:** `200 OK`. Salve `accessToken` em `{{pacienteToken}}`.

---

## 6. Vincular médico ao paciente

`POST {{baseUrl}}/medico-paciente/vincular`

Headers:
```
Authorization: Bearer {{medicoToken}}
Content-Type: application/json
```

Body:
```json
{
  "pacienteId": "{{pacienteId}}"
}
```

**Esperado:** `201 Created`.

---

## 7. Upload de arquivo (médico)

`POST {{baseUrl}}/arquivos/upload`

Headers:
```
Authorization: Bearer {{medicoToken}}
```
*(Não setar `Content-Type` manualmente — o REST client gera o `multipart/form-data; boundary=...` sozinho.)*

Body — `form-data`:
| key         | type | value                                  |
|-------------|------|----------------------------------------|
| arquivo     | File | um PDF qualquer (até 10 MB)            |
| pacienteId  | Text | `{{pacienteId}}`                       |

**Esperado:** `201 Created`. Response deve conter `id`, `nomeOriginal`, `tipo`, `tamanho`, `dataUpload`, `pacienteId`, `medicoUploadId` e **NÃO** deve conter `caminhoStorage` nem `nomeUnico`.

Asserts (Postman tests / Bruno):
```js
const body = pm.response.json();
pm.test('Sem campo sensível', () => {
  pm.expect(body).to.not.have.property('caminhoStorage');
  pm.expect(body).to.not.have.property('nomeUnico');
});
pm.test('Status 201', () => pm.response.to.have.status(201));
```

---

## 8. Listar arquivos como médico

`GET {{baseUrl}}/arquivos`

Headers:
```
Authorization: Bearer {{medicoToken}}
```

**Esperado:** `200 OK` com array contendo o arquivo recém-enviado. Campos:
```json
[
  {
    "id": "...",
    "nomeOriginal": "...",
    "tipo": "application/pdf",
    "tamanho": 12345,
    "dataUpload": "2026-06-17T...",
    "pacienteId": "...",
    "pacienteNome": "Joana Paciente",
    "medicoUploadId": "...",
    "medicoNome": "Dr. Carlos Médico"
  }
]
```

---

## 9. Listar arquivos como paciente

`GET {{baseUrl}}/arquivos`

Headers:
```
Authorization: Bearer {{pacienteToken}}
```

**Esperado:** `200 OK` — array com o mesmo arquivo. Confirma que o `pacienteNome` e o `medicoNome` aparecem (nome, não UUID).

---

## 10. (Negativo) Upload sem vínculo médico-paciente

Pré-condição: registre um segundo paciente sem vínculo com o médico.

`POST {{baseUrl}}/arquivos/upload` com `pacienteId` apontando para esse outro paciente.

**Esperado:** `403 Forbidden` com `"Médico não possui vínculo com o paciente informado"`.

---

## 11. (Negativo) Upload de arquivo não permitido

`POST {{baseUrl}}/arquivos/upload` com `arquivo` = `.txt`.

**Esperado:** `422 Unprocessable Entity` (validação do `ParseFilePipe` — só `application/pdf`, `image/jpeg`, `image/png`).

---

## 12. (Negativo) Upload acima do limite

`POST {{baseUrl}}/arquivos/upload` com `arquivo` > 10 MB.

**Esperado:** `422 Unprocessable Entity`.

---

## 13. (Negativo) Acesso sem token

`GET {{baseUrl}}/arquivos` sem header `Authorization`.

**Esperado:** `401 Unauthorized`.
