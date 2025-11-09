# Registro de Progresso – LMC Site

Este arquivo compila, em ordem cronológica, o que já foi implementado e o que falta para completarmos o portal LMC. Atualizações futuras devem continuar daqui.

## ✅ Entregas concluídas

1. **Guia arquitetural inicial**  
   - `MONOREPO_GUIDE.md` descreve a estratégia do monorepo (Next.js + NestJS + Postgres em um único repositório), infraestrutura no VPS Hostinger e pipelines de deploy via GitHub Actions.

2. **Configuração do monorepo**  
   - Inicialização do repositório com `pnpm`, Turborepo (`turbo.json`), `pnpm-workspace.yaml` e scripts raiz (`dev`, `build`, `lint`, `format`).  
   - Estrutura base criada: `apps/web`, `apps/api`, `packages/types`.

3. **Frontend inicial (Next.js 14 App Router)**  
   - Tela de login (`apps/web/app/(auth)/login`) com formulário funcional apontando para `POST /auth/login`.  
   - Página pós-login (`apps/web/app/(dashboard)`) com mensagem institucional e botões de ação.  
   - Integração com tipos compartilhados (`@lmc/types`) para garantir contratos com a API.

4. **Camada de UI com Tailwind CSS**  
   - Tailwind configurado via `apps/web/tailwind.config.ts` + `postcss.config.mjs`.  
   - Componentes de login/dashboard migrados para utilitários Tailwind mantendo o visual pastel/bege.

5. **Backend NestJS com Sequelize/Postgres**  
   - Módulos configurados: `DatabaseModule` (Sequelize + Postgres), `UsersModule`, `AuthModule`.  
   - Modelo `User` com campos básicos e seed temporário (`demo@lmc.com / Senha@123`).  
   - Endpoint `POST /auth/login` com validação e emissão de JWT (expira em 1h).  
   - Variáveis de ambiente em `.env.example`.

6. **Design refinado para tons pastel/bege escuros**  
   - Nova paleta global (`apps/web/app/globals.css`) com marrons/bege e toques cobre.  
   - Ajustes visuais da tela de login e dashboard para refletir o novo branding (gradientes terrosos, cartões claros, tipografia coerente).

7. **Documentação operacional**  
   - `README.md` descrevendo como rodar o monorepo, preparar `.env` e banco local via docker compose.

8. **Banco de dados local + migrations**  
   - `infra/docker-compose.db.yml` + `.env.db.example` para subir Postgres local com persistência.  
   - Configuração do `sequelize-cli` (`apps/api/.sequelizerc`, `sequelize.config.cjs`) e scripts `pnpm --filter api db:migrate`.  
   - Primeira migration (`20251108000100-create-users-and-admin`) criando tabela `users` e inserindo o usuário admin default controlado por variáveis (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`).

9. **Arquivos de ambiente prontos para uso**  
   - `apps/api/.env.local` e `.env.example` com valores padrão (Postgres local + credenciais admin) para acelerar o setup.  
   - `apps/web/.env.example` e `.env.local` expondo `NEXT_PUBLIC_API_URL`.

10. **Workflows de deploy separados (web/api)**  
    - `.github/workflows/web-deploy.yml` e `.github/workflows/api-deploy.yml` com build, lint e deploy via SSH para o VPS de produção.  
    - Uso de secrets (`VPS_HOST`, `VPS_USER`, `VPS_PORT`, `VPS_SSH_KEY`) e reinício opcional com PM2.

## ⏳ Próximas entregas sugeridas

1. **Postgres real + migrations Sequelize**  
   - Adicionar CLI (sequelize-cli ou um wrapper Nest) e scripts `pnpm --filter api db:migrate`.  
   - Criar primeira migration para `users` e garantir versionamento.

2. **Autenticação completa no frontend**  
   - Persistir o JWT em cookies `httpOnly` ou storage seguro, proteger rotas no App Router e implementar logout real chamando a API.

3. **Fluxo de deploy completo**  
   - Criar Dockerfiles + docker-compose de produção (web/api) e publicar imagens no GHCR.  
   - Ajustar os workflows recém-criados para acionar o `docker compose`/serviços reais no VPS.

4. **Observabilidade e hardening**  
   - Logging estruturado (Nest + web), monitoramento (Sentry/Axiom) e ajustes de segurança (helmet, rate limiting, headers).  
   - Backups automatizados do Postgres e runbook no `docs/`.

5. **Conteúdo do dashboard**  
   - Definir quais métricas/cards aparecerão após login e estruturar componentes modulares no Next.

## 📌 Pendências de curto prazo

- [ ] Integrar o login da web com cookies seguros e middlewares de proteção.  
- [ ] Preparar Dockerfiles + compose para desenvolvimento e produção.  
- [ ] Provisionar o VPS (usuário deploy, Docker, firewall) e testar pipeline mínimo.  
- [ ] Adicionar testes automatizados (unitários na API e componentes no Next).  
- [ ] Criar seeds adicionais/migrations para demais entidades (ex.: permissões, conteúdos iniciais).

> Última atualização: _2025-11-08_
