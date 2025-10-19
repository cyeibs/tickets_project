Deployment Guide (Ubuntu 24.04)

This repo contains client (SPA) and server (Fastify + Prisma) parts. The deployment target is a single Ubuntu host with Nginx as a reverse proxy, systemd to run the backend, and PostgreSQL locally.

What was added

- Nginx site config: `deploy/nginx/lupapp.conf` (SPA + proxy `/api` and `/uploads`)
- systemd service: `deploy/systemd/lupapp-server.service`
- One-time server setup script: `deploy/scripts/setup-server.sh`
- Deploy script (idempotent): `deploy/scripts/deploy.sh`
- GitHub Actions workflow: `.github/workflows/deploy.yml`

Prerequisites

- A server (e.g., `83.166.246.58`) reachable via SSH.
- SSH key-based access for CI (recommended). Add the private key to GitHub Secrets.
- DNS (optional): point your domain to the server IP if you plan to use it.

Required GitHub Secrets
Set these in the repo Settings → Secrets and variables → Actions:

- `SSH_HOST`: e.g. `83.166.246.58`
- `SSH_USER`: e.g. `root`
- `SSH_PRIVATE_KEY`: contents of your private key (PEM), e.g. `~/.ssh/lupapp-prod_rsa`
- `SSH_PORT` (optional): default 22
- `SSH_PASSPHRASE` (if your private key is passphrase-protected)

One-time server bootstrap
The workflow uploads `deploy/**` and runs the setup script automatically, but you need to create the server env file once before successful deploy:

SSH to the server and create `/opt/lupapp/server/.env`:

```bash
ssh root@83.166.246.58
mkdir -p /opt/lupapp/server
cat > /opt/lupapp/server/.env <<'EOF'
NODE_ENV=production
PORT=4001
HOST=0.0.0.0
JWT_SECRET=change_this_secret_to_strong_random
JWT_EXPIRES_IN=7d
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lupapp?schema=public
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
EOF
```

First run can be done either by pushing to `main` (workflow will execute) or manually:

```bash
# If the workflow hasn’t run yet, you can do an initial setup by cloning the repo to /opt/lupapp
# or simply wait for the workflow to copy /deploy and run:
/opt/lupapp/deploy/scripts/setup-server.sh
/opt/lupapp/deploy/scripts/deploy.sh
```

The setup script installs Node 22, Nginx, and PostgreSQL, creates a `lupapp` user, installs the Nginx site, and enables the systemd service.

How it works

- Client build is uploaded to `/var/www/lupapp`.
- Nginx serves the SPA and proxies:
  - `/api/*` → `http://127.0.0.1:4001/*` (Fastify)
  - `/uploads/*` → `http://127.0.0.1:4001/uploads/*`
- Backend runs via systemd: `lupapp-server` (WorkingDirectory `/opt/lupapp/server`).
- Prisma migrations run on each deploy (`yarn prisma:deploy`).

Client → Server base URL
In production, the client uses `/api` automatically. In dev it uses `http://localhost:4001`. You can override via `window.__API_URL__` if needed.

Useful commands (server)

```bash
# Service status / logs
systemctl status lupapp-server
journalctl -u lupapp-server -f

# Nginx
nginx -t && systemctl reload nginx

# DB CLI
sudo -u postgres psql
```

Troubleshooting

- 502 from `/api`: check `systemctl status lupapp-server` and the `.env` `DATABASE_URL`.
- 404 on deep links: ensure Nginx `try_files` in `deploy/nginx/lupapp.conf` is installed and active.
- Permission errors for uploads: ensure `/opt/lupapp/server` is owned by `lupapp:lupapp` (deploy script does this).
