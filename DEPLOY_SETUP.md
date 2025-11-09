# Checklist de Deploy (Produção)

Este documento serve para garantir que todo o fluxo de CI/CD e containers funcione corretamente no ambiente de produção (VPS Hostinger).

## 1. Pré-requisitos no VPS

1. **Docker + Docker Compose v2** instalados.  
   ```bash
   apt update && apt install -y docker.io docker-compose-plugin
   ```
2. **Usuário com acesso SSH** (ex.: `root` ou `deploy`) e chave pública configurada.
3. **Diretório do projeto** já clonado (`~/lmc-site`) com o repositório atualizado (`git pull origin main`).
4. **Volume de dados** do Postgres mantido (compose cria `postgres_data` automaticamente).

## 2. Secrets no GitHub

Cadastre os seguintes secrets em `Settings > Secrets and variables > Actions` no repositório `levymc/lmc-site`:

| Secret | Descrição |
|--------|-----------|
| `GHCR_USERNAME` | Usuário/namespace do GitHub Container Registry (ex.: `levymc`) |
| `GHCR_TOKEN` | Personal Access Token com `write:packages` + `read:packages` |
| `VPS_HOST` | IP ou domínio do servidor SSH (`82.25.79.82`) |
| `VPS_USER` | Usuário SSH (ex.: `root` ou `deploy`) |
| `VPS_PORT` | Porta SSH (`22`, se padrão) |
| `VPS_SSH_KEY` | Chave privada PEM com acesso ao servidor |
| `PROD_DB_ENV` | Conteúdo do arquivo `infra/env/db.env` (linhas `CHAVE=valor`) |
| `PROD_API_ENV` | Conteúdo de `infra/env/api.env` (linhas completas) |
| `PROD_WEB_ENV` | Conteúdo de `infra/env/web.env` |
| `PROD_WEB_API_URL` | URL pública usada na build do Next (`https://lmcfactory.com.br/api`) |

> **Observação:** Os três secrets `PROD_*_ENV` devem conter exatamente o texto que iria nos arquivos `.env` correspondentes; o workflow cria/regrava esses arquivos automaticamente no VPS antes de subir os containers.

## 3. Primeiro deploy manual

1. Autentique o servidor no GHCR (apenas uma vez):
   ```bash
   docker login ghcr.io -u <GHCR_USERNAME> -p <GHCR_TOKEN>
   ```
2. Garanta que os exemplos foram duplicados localmente caso queira revisá-los:
   ```bash
   cp infra/env/db.env.example infra/env/db.env
   cp infra/env/api.env.example infra/env/api.env
   cp infra/env/web.env.example infra/env/web.env
   # Ajuste valores conforme necessário
   ```
3. Rode o compose uma vez para criar volumes e containers base:
   ```bash
   docker compose -f infra/docker-compose.prod.yml up -d
   ```
4. Verifique os logs e healthchecks:
   ```bash
   docker compose -f infra/docker-compose.prod.yml ps
   docker logs lmc-api   # se necessário
   docker logs lmc-web
   ```

## 4. Fluxo automático (GitHub Actions)

Após qualquer push na branch `main`:
1. `web-deploy.yml` e `api-deploy.yml`:
   - Instalam deps com pnpm.
   - Rodam lint + build.
   - Constroem e publicam as imagens (`ghcr.io/<namespace>/lmc-web` ou `lmc-api`).
   - Conectam via SSH no VPS, atualizam o repositório (`git reset --hard origin/main`).
   - Recriam `infra/env/*.env` a partir dos secrets (`PROD_DB_ENV`, `PROD_API_ENV`, `PROD_WEB_ENV`).
   - Executam `docker compose -f infra/docker-compose.prod.yml pull <service>` + `up -d <service>`.
   - Fazem `docker image prune -f` para limpar imagens antigas.

2. Os containers (web/api) sobem com a imagem recém-publicada; Postgres permanece com volume persistente.

## 5. Boas práticas

- **Backups:** agende `pg_dump` diário (pode ser cron no host ou outro container).  
- **Monitoramento:** configure logs centralizados e alertas de saúde dos containers.  
- **Rotação de segredos:** troque senhas e renove PATs periodicamente.  
- **Auditoria:** revise execuções dos workflows e mantenha branch `main` protegida (requer PR + aprovação + lint/test).

Seguindo este checklist, qualquer push na `main` gera uma imagem docker atualizada e o VPS pega essa versão automaticamente, mantendo o ambiente de produção sincronizado com o repositório. 
