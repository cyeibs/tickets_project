Lupapp Server

Backend for Telegram Mini App (tickets & events) built with Fastify + Prisma + PostgreSQL.

Quick start

1. Copy env

```bash
cp ENV_EXAMPLE .env
```

2. Start Postgres (Docker)

```bash
docker compose up -d
```

3. Install deps and run migrations

```bash
yarn
yarn prisma:generate
yarn prisma:migrate
```

4. Seed database

```bash
yarn db:seed
```

5. Run dev server

```bash
yarn dev
```

Server runs on http://localhost:4000

Scripts

- `yarn dev` – dev server with auto-reload
- `yarn prisma:migrate` – create/apply migrations in dev
- `yarn prisma:deploy` – apply migrations in prod
- `yarn db:seed` – seed data
- `yarn db:reset` – reset database + seed (non-interactive)

Structure

- `src/` – app code (Fastify plugins, routes, modules)
- `prisma/` – Prisma schema and seeds
- `uploads/` – uploaded files (served at `/uploads/*`)

Auth
JWT-based auth. Register/login to get token. Send token via `Authorization: Bearer <token>`.
