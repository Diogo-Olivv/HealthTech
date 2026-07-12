# Setup Inicial

Guia completo para rodar o projeto do zero após clonar o repositório. Cobre o caminho "tudo em Docker" (recomendado) e o caminho híbrido (banco em Docker, backend e frontend fora).

---

## Pré-requisitos

### Node.js

O projeto usa Node.js **v22** nas imagens do Docker. Localmente, qualquer LTS acima de v20 costuma funcionar, mas se algo divergir, alinhe com a versão do container.

**Verificar se já está instalado**

```bash
node --version
npm --version
```

**Instalar (caso não tenha)**

- Baixe a versão LTS em [https://nodejs.org](https://nodejs.org).
- No Linux, prefira o [nvm](https://github.com/nvm-sh/nvm):
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  nvm install --lts
  nvm use --lts
  ```

### Docker

Usado para PostgreSQL, Adminer, backend e frontend.

**Windows**

1. Baixe o [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop).
2. Mantenha a opção **WSL 2** marcada durante a instalação.
3. Abra o Docker Desktop e aguarde o ícone ficar verde na bandeja do sistema.
4. Verifique:
   ```bash
   docker --version
   docker compose version
   ```

**Linux (Ubuntu/Debian)**

```bash
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

sudo usermod -aG docker $USER
newgrp docker

docker --version
docker compose version
```

### Git

**Windows**: instale em [https://git-scm.com](https://git-scm.com) com as opções padrão.

**Linux**:

```bash
sudo apt-get install -y git
```

---

## 1. Clonar o repositório

```bash
git clone https://github.com/Diogo-Olivv/HealthTech.git
cd HealthTech
```

---

## 2. Configurar variáveis de ambiente

### Backend

```bash
cd backend
cp .env.example .env
cd ..
```

O `.env` já vem com valores padrão para desenvolvimento. Ajuste apenas se for necessário. Exemplo de conteúdo relevante:

```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

JWT_SECRET=dev-secret-change-me
JWT_EXPIRES_IN=1d

DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=healthtech

STORAGE_DRIVER=local
LOCAL_STORAGE_DIR=uploads
```

Se você rodar o backend **dentro do Docker Compose**, o `docker-compose.yml` sobrescreve `DB_HOST=postgres` automaticamente.

### Frontend

```bash
cd frontend
cp .env.example .env
cd ..
```

Conteúdo padrão:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Nunca commite `backend/.env` ou `frontend/.env`. Em produção, tudo entra pelo Secret Manager.

---

## 3. Subir a aplicação com Docker Compose (recomendado)

Da raiz do repositório:

```bash
docker compose up --build
```

Isso constrói e sobe banco, backend e frontend juntos. As migrations do TypeORM rodam automaticamente no boot do backend (`migrationsRun: true` fora de produção).

Verifique os containers:

```bash
docker compose ps
```

URLs padrão:

| Serviço  | URL                    |
| -------- | ---------------------- |
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:3001  |
| Swagger  | http://localhost:3001/docs |
| Adminer  | http://localhost:8080  |

Para parar:

```bash
docker compose down       # mantém volumes
docker compose down -v    # apaga banco e uploads (reset completo)
```

---

## 4. Rodar sem Docker (opcional, para hot-reload isolado)

Se preferir rodar backend ou frontend fora do container para debug e hot-reload:

```bash
# Sobe apenas banco e Adminer
docker compose up postgres adminer -d
```

Backend em outro terminal:

```bash
cd backend
npm install
npm run start:dev
```

Frontend em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 5. Verificar que tudo está funcionando

Cadastro de paciente:

```bash
curl -i -X POST http://localhost:3001/users/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Paciente",
    "email": "ana@email.com",
    "password": "senha123",
    "cpf": "000.000.000-00",
    "dataNascimento": "1990-01-01"
  }'
```

Login:

```bash
curl -i -X POST http://localhost:3001/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ana@email.com", "password": "senha123"}'
```

Health check:

```bash
curl http://localhost:3001/health
```

Você pode inspecionar as rotas disponíveis no Swagger em `http://localhost:3001/docs`.

---

## 6. Visualizar o banco no Adminer

Abra `http://localhost:8080` e preencha:

| Campo         | Valor        |
| ------------- | ------------ |
| Sistema       | PostgreSQL   |
| Servidor      | `postgres`   |
| Usuário       | `postgres`   |
| Senha         | `postgres`   |
| Base de dados | `healthtech` |

Navegue até **healthtech > Schemas > public > Tables** para ver `users`, `pacientes`, `medicos`, `especialidades`, `medico_paciente`, `arquivos`, `audit_logs` e a tabela de controle `migrations`.

---

## 7. Criar o primeiro usuário ADMIN (opcional)

Necessário para acessar `GET /audit/logs`. Não existe rota pública que crie um ADMIN.

1. Preencha em `backend/.env`:
   ```
   ADMIN_EMAIL=admin@healthtech.dev
   ADMIN_PASSWORD=uma-senha-forte
   ```
2. Execute o seed:
   ```bash
   cd backend
   npm run seed:admin
   ```

O script é idempotente: se já existir usuário com o e-mail informado, nada muda. Em `NODE_ENV=production` o seed é bloqueado, a menos que `ADMIN_SEED_ALLOW_PROD=true` seja definido explicitamente.

---

## Comandos úteis do dia a dia

```bash
# Parar tudo
docker compose down

# Resetar banco e uploads
docker compose down -v && docker compose up -d

# Rodar apenas o backend (sem Docker), matando processo travado na porta 3001
cd backend && npm run start:dev

# Gerar nova migration a partir do diff de entidades
cd backend && npm run migration:generate -- src/migrations/NomeDescritivo

# Testes
cd backend && npm test
cd backend && npm run test:e2e
cd frontend && npm test
```

Se a porta 3001 travar ao reiniciar o backend fora do Docker:

```bash
# Linux/macOS
kill $(lsof -ti:3001)

# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
```

---

## Problemas comuns

**`Cannot connect to the Docker daemon`**
Docker Desktop não está aberto. Abra e aguarde o ícone ficar verde.

**`Error: connect ECONNREFUSED 127.0.0.1:5433`**
O banco não está rodando. Execute `docker compose up postgres -d` na raiz.

**`Error: listen EADDRINUSE :::3001`**
Porta 3001 ocupada. Use o comando de liberar porta acima.

**Tabelas não aparecem no Adminer**
O backend precisa ter subido ao menos uma vez para que as migrations rodem. Suba com `npm run start:dev` ou via Docker Compose.

**`400 Bad Request` no cadastro por causa do campo `tipo`**
O `ValidationPipe` está com `forbidNonWhitelisted: true`. Envie somente os campos declarados no DTO.

---

## Referências

- [Node.js, downloads](https://nodejs.org/en/download)
- [nvm, Node Version Manager](https://github.com/nvm-sh/nvm)
- [Docker Desktop, Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Docker Engine, Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Docker Compose, primeiros passos](https://docs.docker.com/compose/gettingstarted/)
- [NestJS, instalação](https://docs.nestjs.com/first-steps)
- [Next.js, instalação](https://nextjs.org/docs/getting-started/installation)
- [Adminer](https://www.adminer.org/)
