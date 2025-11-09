# LMC Monorepo

Monorepo em TypeScript contendo o frontend Next.js (`apps/web`), o backend NestJS com Sequelize (`apps/api`) e pacotes compartilhados (`packages/*`).

## Desenvolvimento

```bash
pnpm install

# preparar ambientes
cp apps/api/.env.local apps/api/.env          # ou copie do .env.example
cp apps/web/.env.local apps/web/.env.local    # já aponta para http://localhost:3001
cd infra && cp .env.db.example .env.db && cd ..

# subir banco
docker compose -f infra/docker-compose.db.yml --env-file infra/.env.db up -d

# aplicar migrations
pnpm --filter api db:migrate

# iniciar apps
pnpm dev                  # roda web e api juntos
pnpm --filter web dev     # apenas frontend
pnpm --filter api start:dev   # apenas backend
```

- **Frontend:** http://localhost:3000 (Next.js App Router + Tailwind CSS). `NEXT_PUBLIC_API_URL` vem do `.env.local`.
- **Backend:** http://localhost:3001/api. Há o usuário `demo@lmc.com / Senha@123` (seed temporário) e o admin definido via `.env`.
- **Banco local:** `infra/docker-compose.db.yml` com persistência em volume nomeado.

## Deploy automatizado (produção)

- **Dockerfiles** em `apps/web/Dockerfile` e `apps/api/Dockerfile` produzem imagens publicadas em `ghcr.io`.
- `infra/docker-compose.prod.yml` sobe `postgres`, `api` e `web`. Crie os arquivos de ambiente no servidor:
  ```bash
  cp infra/env/db.env.example infra/env/db.env
  cp infra/env/api.env.example infra/env/api.env
  cp infra/env/web.env.example infra/env/web.env
  ```
  Ajuste senhas/domínios (`NEXT_PUBLIC_API_URL` deve apontar para o endpoint público do backend).
- Secrets necessários no repositório:
  - `GHCR_USERNAME` / `GHCR_TOKEN` (PAT com `write:packages` e `read:packages`).
  - `VPS_HOST`, `VPS_USER`, `VPS_PORT` (opcional, default 22), `VPS_SSH_KEY` (chave privada com acesso ao VPS).
  - `PROD_WEB_API_URL` (ex.: `https://lmcfactory.com.br/api`, usado como build arg do Next).
  - `PROD_DB_ENV`, `PROD_API_ENV`, `PROD_WEB_ENV`: conteúdo completo dos arquivos `infra/env/*.env` (exatamente como ficariam no servidor).
- Workflows (`.github/workflows/web-deploy.yml` e `api-deploy.yml`) fazem:
  1. Checkout, `pnpm install --frozen-lockfile`, lint/build do app.
  2. Build + push da imagem (`docker/build-push-action`) para `ghcr.io/${GHCR_USERNAME}/lmc-web|lmc-api:latest`.
  3. SSH no VPS, `git pull`, `docker login ghcr.io`, `docker compose -f infra/docker-compose.prod.yml pull <service>` e `up -d <service>`.
  4. Limpeza de imagens antigas (`docker image prune -f`).
- No VPS:
  - Workflows já recriam `infra/env/db.env`, `infra/env/api.env`, `infra/env/web.env` a cada deploy usando os secrets acima.
  - Garanta Docker Engine + Compose v2 instalados e login no GHCR.
  - Rode `docker compose -f infra/docker-compose.prod.yml up -d` para a primeira subida; os deploys seguintes apenas farão `pull`/`up`.
  - O compose usa `ghcr.io/${GHCR_NAMESPACE:-levymc}`; se usar outro namespace, exporte `GHCR_NAMESPACE` antes de rodar o compose ou altere o arquivo.

## Estrutura atual

- `apps/web`: tela de login e dashboard pós-login com Tailwind e layout pastel/bege.
- `apps/api`: NestJS + Sequelize (`User` model, módulo de autenticação e seed temporário).
- `packages/types`: contratos compartilhados (`AuthResponse`, `UserProfile`).
- `MONOREPO_GUIDE.md`: visão arquitetural e plano de deploy (VPS Hostinger, Docker, banco Postgres).

## Próximos passos

1. Configurar o Postgres (local e VPS) e adicionar as migrations Sequelize.
2. Implementar persistência real de sessões/JWT (cookies HTTPOnly) e middleware de guarda de rotas no Next.
3. Automatizar deploy com GitHub Actions (`web-deploy`, `api-deploy`, `db-migrate`).
