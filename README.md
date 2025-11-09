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

- **Frontend:** http://localhost:3000 (Next.js App Router). `NEXT_PUBLIC_API_URL` vem do `.env.local`.
- **Backend:** http://localhost:3001/api. Há o usuário `demo@lmc.com / Senha@123` (seed temporário) e o admin definido via `.env`.
- **Banco local:** `infra/docker-compose.db.yml` com persistência em volume nomeado.

## Estrutura atual

- `apps/web`: tela de login e dashboard pós-login com copy de boas-vindas.
- `apps/api`: NestJS + Sequelize (`User` model, módulo de autenticação e seed temporário).
- `packages/types`: contratos compartilhados (`AuthResponse`, `UserProfile`).
- `MONOREPO_GUIDE.md`: visão arquitetural e plano de deploy (VPS Hostinger, Docker, banco Postgres).

## Próximos passos

1. Configurar o Postgres (local e VPS) e adicionar as migrations Sequelize.
2. Implementar persistência real de sessões/JWT (cookies HTTPOnly) e middleware de guarda de rotas no Next.
3. Automatizar deploy com GitHub Actions (`web-deploy`, `api-deploy`, `db-migrate`).
