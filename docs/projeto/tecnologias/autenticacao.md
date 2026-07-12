# Autenticação

## JWT (JSON Web Tokens)

**O que é**

JWT é um padrão para transmissão segura de informações entre partes como um token assinado. Após o login, o servidor gera um token que o cliente envia em todas as requisições subsequentes para provar identidade.

**Como funciona no projeto**

- `POST /users/login` valida credenciais e retorna `{ accessToken, user }`.
- O token inclui `id` e `tipo` no payload, evitando lookup no banco por requisição.
- Toda rota protegida usa `@UseGuards(JwtAuthGuard)`; rotas por perfil usam também `@UseGuards(RolesGuard)` com `@Roles(...)`.
- Expiração padrão: `JWT_EXPIRES_IN=1d`.

**Biblioteca**: `@nestjs/jwt` + `passport-jwt`.

---

## Cookie httpOnly

O frontend não guarda o token em `localStorage`. Após o login, o **route handler** de Next.js (`POST /api/auth/login`) grava um cookie **httpOnly** chamado `accessToken`, invisível para o JavaScript do cliente. A cada chamada, o proxy `/api/proxy/[...path]` lê o cookie e injeta `Authorization: Bearer <token>` no request encaminhado ao backend.

- Reduz o vetor de ataque XSS: token não é exfiltrável via `document.cookie` no cliente.
- Elimina CORS entre o navegador e o backend: o navegador vê apenas o Next.

---

## bcrypt

**O que é**

Algoritmo de hashing projetado para senhas. É intencionalmente lento e usa salt aleatório, o que torna ataques de força bruta computacionalmente inviáveis.

**Como funciona no projeto**

```typescript
// Cadastro: gera o hash e persiste
const passwordHash = await bcrypt.hash(password, 10);

// Login: compara senha com o hash
const isValid = await bcrypt.compare(password, user.passwordHash);
```

Salt rounds fixados em `10`.

---

## Roles e perfis

- `PACIENTE`: usuário final. Vê seus arquivos, aprova ou rejeita solicitações de vínculo.
- `MEDICO`: profissional de saúde. Solicita vínculos, faz upload e listagem de arquivos, consulta prontuário de pacientes vinculados.
- `ADMIN`: perfil operacional. Único autorizado a consultar `GET /audit/logs`. Só pode ser criado via `npm run seed:admin`.

---

## Referências

- [JWT, introdução](https://jwt.io/introduction)
- [bcrypt no npm](https://www.npmjs.com/package/bcrypt)
- [Passport.js, documentação](https://www.passportjs.org/)
