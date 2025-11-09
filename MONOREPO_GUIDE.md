# Guia inicial – Monorepo Next.js + NestJS + Postgres

Este documento resume como organizar o repositório `lmc-site`, definir fluxos de trabalho e preparar o VPS para hospedar frontend, backend e banco de dados de maneira independente.

## 1. Visão geral
- **Stack:** TypeScript em todas as camadas; Next.js (frontend), NestJS (backend) e Postgres (banco).
- **Repositório único (monorepo):** facilita o versionamento e reutilização de código/infra, garantindo que web/API compartilhem tipos e configs.
- **Deploys separados:** cada app gera sua própria imagem/container; pipelines distintos, porém no mesmo repositório.
- **Infra como código:** docker-compose para desenvolvimento local e para o VPS; scripts de provisionamento (opcionalmente Ansible) podem viver em `infra/`.

## 2. Estrutura sugerida
```
.
├── apps/
│   ├── web/          # Next.js 14 (App Router), hospedado via `next start` ou edge
│   └── api/          # NestJS, exposto atrás de um reverse proxy (NGINX / Caddy)
├── packages/
│   ├── config/       # tsconfig base, eslint config, etc.
│   ├── ui/           # componentes compartilhados (Storybook opcional)
│   └── types/        # contratos entre web e api (por ex., zod/prisma types)
├── infra/
│   ├── docker/       # docker-compose.*.yml, scripts de deploy, arquivos de env exemplo
│   └── ansible/      # playbooks para provisionar VPS (opcional)
└── docs/
    └── MONOREPO_GUIDE.md
```

- Use `pnpm` (ou `npm` workspaces) para gerenciar dependências. Exemplo de `package.json` raiz:
  ```jsonc
  {
    "private": true,
    "packageManager": "pnpm@9.0.0",
    "workspaces": ["apps/*", "packages/*"],
    "scripts": {
      "dev": "turbo dev",
      "build": "turbo build",
      "lint": "turbo lint"
    },
    "devDependencies": {
      "turbo": "^2.0.0"
    }
  }
  ```
- Turborepo/Nx simplificam cache e paralelização. Se preferir scripts simples, mantenha `apps/web` e `apps/api` com scripts próprios.

## 3. Banco de dados (Postgres)
- **Local:** utilize Docker para subir um Postgres isolado:
  ```yaml
  services:
    db:
      image: postgres:16-alpine
      environment:
        POSTGRES_DB: lmc
        POSTGRES_USER: lmc
        POSTGRES_PASSWORD: lmc
      ports:
        - "5432:5432"
      volumes:
        - ./postgres-data:/var/lib/postgresql/data
  ```
- **ORM/Migrations:** neste projeto usaremos **Sequelize** com `sequelize-typescript`, mas TypeORM também funciona. Centralize configs em `apps/api/src/database`.
  - Use `pnpm --filter api db:migrate` (ou scripts dedicados) para criar/aplicar migrations (primeira migration já cria `users` + admin).
  - Gere tipos compartilhados (ex.: `UserProfile`) em `packages/types` para o Next.js reaproveitar contratos da API.
- **Gestão:** agende backups da base no VPS (dump diário). Se usar Docker, monte volume persistente e configure `pg_dump` via cron do host.

## 4. Fluxo de desenvolvimento
1. `pnpm install`
2. `pnpm dev` (ou `pnpm --filter web dev` / `pnpm --filter api start:dev`).
3. Utilize `.env` separados: `.env.local`, `.env.api`, `.env.web`. Nunca commitar valores sensíveis; use `.env.example`.
4. Lindar/testar antes de abrir PR:
   - `pnpm lint`
   - `pnpm test` (Jest para API; Playwright/React Testing Library para web)

## 5. Deploy e CI/CD
### GitHub
- Configure branch principal (`main`) protegida. Pull requests exigem lint/test + migrations secas.
- Use **GitHub Actions** com workflows separados:
  1. `web-deploy.yml`: instala dependências, roda lint/build e em seguida gera/push uma imagem Docker (`apps/web/Dockerfile`) para o GHCR.
  2. `api-deploy.yml`: mesmo fluxo para a API, incluindo `pnpm --filter @lmc/api db:migrate` dentro do container após subir.
  3. (Opcional) workflows auxiliares para smoke tests/end-to-end, se necessário.

### VPS Hostinger (`root@82.25.79.82`)
1. **Provisionamento inicial**
   - Criar usuário `deploy` sem privilégios e liberar SSH com chave.
   - Instalar Docker + Docker Compose v2.
   - Configurar firewall liberando apenas HTTP/HTTPS/SSH.
2. **Layout no servidor**
   ```
   ~/lmc-site/
     ├── infra/
     │   ├── docker-compose.prod.yml
     │   └── env/
     │       ├── db.env
     │       ├── api.env
     │       └── web.env
     └── (demais arquivos do repo)
   ```
3. **Reverse proxy**
   - Use Nginx/Caddy/Traefik em frente aos containers conforme necessidade (não incluído no compose atual).
4. **docker-compose.prod.yml** (resumido):
   ```yaml
   services:
     postgres:
       image: postgres:16-alpine
       env_file: ./env/db.env
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports: ["5432:5432"]
     api:
       image: ghcr.io/<org>/lmc-api:latest
       env_file: ./env/api.env
       depends_on:
         postgres:
           condition: service_healthy
       ports: ["3001:3001"]
     web:
       image: ghcr.io/<org>/lmc-web:latest
       env_file: ./env/web.env
       depends_on:
         - api
       ports: ["3000:3000"]
   volumes:
     postgres_data:
   ```
5. **Deploy automatizado**
   - Workflows se autenticam no GHCR, sobem imagens e, via SSH no VPS, executam `docker compose -f infra/docker-compose.prod.yml pull <service>` seguido de `docker compose ... up -d <service>`.
   - Certifique-se de que os arquivos `env/*.env` existam apenas no servidor (baseados nos `.example` do repositório).

## 6. Boas práticas adicionais
- **Versionamento de schema:** garanta que o backend só sobe após `pnpm --filter @lmc/api db:migrate`. Use health checks no compose.
- **Observabilidade:** adicione logging estruturado (pino/winston) e métricas (OpenTelemetry) no NestJS. Para Next, configure monitoramento (Sentry).
- **Documentação:** mantenha `docs/` para decisões arquiteturais (ADR), diagramas e runbooks.
- **Segurança:** rotacione senhas do banco, armazene secrets no GitHub Actions; use `.env.production` apenas no server.
- **Backups/restore tests:** automatize `pg_dump` diário e teste o restore mensalmente.

## 7. Próximos passos sugeridos
1. Inicializar `pnpm` + Turborepo e criar scaffolds `apps/web` e `apps/api`.
2. Configurar Sequelize CLI/migrations no backend e criar a primeira migration.
3. Escrever workflows GitHub Actions para build/test das duas apps.
4. Provisionar o VPS (usuário deploy, Docker, firewall) e subir docker-compose com versões dummy para validar pipeline.

Com esse guia você terá o repositório organizado, ambientes previsíveis e deploys independentes para web, API e banco. Ajuste conforme o produto evoluir (ex.: adicionar fila, cache, etc.). Boa construção! 
