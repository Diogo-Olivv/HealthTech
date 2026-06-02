# Frontend

## Next.js + TypeScript

**O que é:**
Next.js é um framework React para construção de aplicações web. Ele adiciona sobre o React funcionalidades como roteamento baseado em arquivos, renderização no servidor (SSR) e geração estática (SSG), tornando o desenvolvimento mais estruturado e a aplicação mais performática.

**Como funciona no projeto:**
Utilizamos o **App Router** (introduzido no Next.js 13), onde cada pasta dentro de `src/app/` representa uma rota. O arquivo `page.tsx` dentro de uma pasta é automaticamente a página daquela rota:

```
src/app/register/page.tsx   gera a rota   http://localhost:3000/register
src/app/page.tsx            gera a rota   http://localhost:3000/
```

Os componentes marcados com `'use client'` rodam no navegador (podem usar hooks como `useState`). Sem essa diretiva, o componente roda no servidor por padrão.

**Por que foi escolhido:**

- Padrão consolidado no mercado para aplicações React em produção
- Integração nativa com TypeScript
- Deploy simplificado no Google Cloud Run ou Vercel
- Grande comunidade e documentação extensa
- Facilita a separação entre componentes de servidor e cliente

---

## Cascading Style Sheet (CSS)

**O que é:**
CSS é um arquivo de estilização, nesse projeto cada componente tem seu próprio arquivo `.module.css`. As classes são escopadas automaticamente, não há conflito de nomes entre componentes diferentes.

**Como funciona:**

```tsx
import styles from "./register.module.css";

// styles.button é único para este componente
<button className={styles.button}>Cadastrar</button>;
```

**Por que foi escolhido:**

- Sem configuração extra, padrão do Next.js
- Evita conflitos de CSS em projetos com múltiplos desenvolvedores
- Padrão Mundial

---

## Referências

- [Documentação oficial - Next.js](https://nextjs.org/docs)
- [App Router - Next.js](https://nextjs.org/docs/app/building-your-application/routing)
- [CSS Modules - Next.js](https://nextjs.org/docs/app/building-your-application/styling/css-modules)
