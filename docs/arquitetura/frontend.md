# Frontend

## Estrutura de camadas

O frontend é organizado em três camadas com responsabilidades distintas:

```
src/
├── app/                  # Páginas (rotas da aplicação)
│   └── register/
│       ├── register.module.css # Estilização
│       └── page.tsx      # Renderização e estado visual
├── services/             # Comunicação com a API
│   └── users.service.ts  # Chamadas HTTP ao backend
└── dto/                  # Data Transfer Object
    └── users.dto.ts      # Formatos de request e response
```

**Regra fundamental:** cada camada conhece apenas a camada abaixo dela.

- A página chama o service. A página **não** faz `fetch` diretamente.
- O service chama a API. O service **não** gerencia estado visual.
- O DTO define os tipos. O DTO **não** tem lógica.

---

## Fluxo de um cadastro

```
1. Usuário preenche o formulário e clica em "Cadastrar"
2. page.tsx chama registerUser(form)
3. users.service.ts monta e envia o POST /api/users/register
4. Backend processa e retorna { id, email, name }
5. page.tsx atualiza o estado visual (success ou error)
6. Usuário vê o feedback na tela
```

---

## Por que usar um service separado?

Sem o service, o `fetch` ficaria diretamente na página. O problema: se 3 páginas diferentes precisarem cadastrar um usuário, o código de chamada HTTP se repete 3 vezes. Com o service, a lógica de comunicação existe em **um único lugar**. Se a URL da API mudar, você altera apenas `users.service.ts`.

---

## Referências

- [Documentação Next.js - App Router](https://nextjs.org/docs/app)
