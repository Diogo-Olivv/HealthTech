# Setup Inicial

Guia completo para rodar o projeto do zero após clonar o repositório.

---

## Pré-requisitos

### Node.js

O projeto requer **Node.js v18 ou superior**.

**Verificar se já está instalado:**

```bash
node --version   # deve mostrar v18.x.x ou superior
npm --version
```

**Instalar (caso não tenha):**

- Acesse [https://nodejs.org](https://nodejs.org) e baixe a versão **LTS**
- No Linux, é recomendado usar o [nvm](https://github.com/nvm-sh/nvm):
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  # Reinicie o terminal, depois:
  nvm install --lts
  nvm use --lts
  ```

### Docker

O Docker é usado para rodar o banco de dados PostgreSQL localmente.

**Windows:**

1. Acesse [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Baixe e instale o **Docker Desktop para Windows**
3. Durante a instalação, mantenha a opção **WSL 2** marcada
4. Após instalar, abra o Docker Desktop e aguarde o ícone ficar verde na bandeja do sistema
5. Verifique no terminal:
   ```bash
   docker --version
   docker compose version
   ```

**Linux (Ubuntu/Debian):**

```bash
# Instalar Docker Engine
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Permitir rodar Docker sem sudo
sudo usermod -aG docker $USER
newgrp docker

# Verificar
docker --version
docker compose version
```

### Git

**Windows:** Baixe em [https://git-scm.com](https://git-scm.com) e instale com as opções padrão.

**Linux:**

```bash
sudo apt-get install -y git
```

---

## 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITÓRIO>
cd HealthTech
```

---

## 2. Configurar variáveis de ambiente

### Backend

Na **raiz** do repositório rode:

```bash
cd backend
cp .env.example .env
```

O arquivo `.env` criado já vem com os valores corretos para desenvolvimento local. **Não altere nada por enquanto.**

Conteúdo padrão do `.env` para dev:

```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=healthtech

INSTANCE_CONNECTION_NAME=
```

### Frontend

Na **raiz** do repositório rode:

```bash
cd frontend
cp .env.example .env
```

---

## 3. Instalar dependências

Execute a partir da raiz do projeto:

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

---

## 4. Subir a aplicação

A partir da **raiz do projeto** (pasta `HealthTech`):

```bash
docker compose up -d
```

Verifique se os containers estão rodando:

```bash
docker compose ps
```

> **Windows:** se o comando `docker compose` não funcionar, verifique se o Docker Desktop está aberto e com o ícone verde na bandeja do sistema.

---

## 5. Verificar que tudo está funcionando

Com backend e banco rodando, teste a API:

**Linux / macOS / Windows (PowerShell 7+):**

```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@healthtech.com","password":"senha123"}'
```

**Windows (PowerShell padrão):**

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/users/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Teste","email":"teste@healthtech.com","password":"senha123"}'
```

Resposta esperada:

```json
{
  "id": "...",
  "email": "teste@healthtech.com",
  "name": "Teste"
}
```

Acesse também `http://localhost:3000/register` para ver o formulário de cadastro.

---

## 6. Visualizar o banco de dados

Acesse o **Adminer** em `http://localhost:8080` e preencha:

| Campo         | Valor        |
| ------------- | ------------ |
| Sistema       | PostgreSQL   |
| Servidor      | `postgres`   |
| Usuário       | `postgres`   |
| Senha         | `postgres`   |
| Base de dados | `healthtech` |

Navegue até **healthtech > Schemas > public > Tables > users** para ver os registros cadastrados.

---

## Comandos úteis do dia a dia

### Parar a execução do projeto

````bash

docker compose down

### Resetar o banco (apaga todos os dados)

```bash
docker compose down -v && docker compose up -d
````

### Porta 3001 travada ao reiniciar o backend

No caso de reinicio do backend, caso ele não inicie corretamente pela rota não ter sido liberada corretamente, rode:

```bash
# Linux/macOS
kill $(lsof -ti:3001)

# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
```

---

## Problemas comuns

### `Cannot connect to the Docker daemon`

O Docker Desktop não está aberto. Abra o aplicativo e aguarde o ícone ficar verde.

### `Error: connect ECONNREFUSED 127.0.0.1:5433`

O banco não está rodando. Execute `docker compose up -d` na raiz do projeto.

### `Error: listen EADDRINUSE :::3001`

A porta 3001 está em uso. Use o comando de liberar porta acima.

### Tabelas não aparecem no Adminer/DBeaver

O backend precisa estar rodando ao menos uma vez para o TypeORM criar as tabelas. Suba o backend com `npm run start:dev` e tente novamente.

---

## Referências

- [Node.js - Downloads](https://nodejs.org/en/download)
- [nvm - Node Version Manager](https://github.com/nvm-sh/nvm)
- [Docker Desktop - Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Docker Engine - Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Docker Compose - Getting Started](https://docs.docker.com/compose/gettingstarted/)
- [NestJS - Installation](https://docs.nestjs.com/first-steps)
- [Next.js - Installation](https://nextjs.org/docs/getting-started/installation)
- [Adminer - Documentação](https://www.adminer.org/)
- [DBeaver - Download](https://dbeaver.io/download/)
