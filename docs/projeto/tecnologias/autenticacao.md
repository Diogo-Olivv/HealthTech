# Autenticação

## JWT - JSON Web Tokens

**O que é:**
JWT é um padrão para transmissão segura de informações entre partes como um token assinado. Após o login, o servidor gera um token que o cliente envia em todas as requisições subsequentes para provar sua identidade.

**Biblioteca:** `@nestjs/jwt` + `passport-jwt`

---

## bcrypt

**O que é:**
bcrypt é um algoritmo de hashing especialmente projetado para senhas. Diferente de MD5 ou SHA, ele é intencionalmente lento e usa um "salt" aleatório, o que torna ataques de força bruta computacionalmente inviáveis.

**Como funciona no projeto:**

```typescript
// Cadastro: gera o hash da senha e guarda no banco
const passwordHash = await bcrypt.hash(password, 10);

// Login: compara senha digitada com hash armazenado
const isValid = await bcrypt.compare(password, user.passwordHash);
```

**Por que foi escolhido:**

- Padrão da indústria para hashing de senhas
- Resistente a ataques de rainbow table (salt automático)

---

## Referências

- [JWT - Introdução](https://jwt.io/introduction)
- [bcrypt - npm](https://www.npmjs.com/package/bcrypt)
- [Passport.js - Documentação](https://www.passportjs.org/)
