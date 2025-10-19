#!/usr/bin/env bash
set -euo pipefail

# Continuous deployment script to be run on the server

APP_USER="lupapp"
APP_DIR="/opt/lupapp"
SERVER_DIR="$APP_DIR/server"
WEB_ROOT="/var/www/lupapp"

echo "[deploy] Preparing environment..."
corepack enable || true
corepack prepare yarn@1.22.22 --activate || true

echo "[deploy] Installing server dependencies..."
cd "$SERVER_DIR"
yarn install --frozen-lockfile

echo "[deploy] Running Prisma migrations..."
yarn prisma:deploy

echo "[deploy] Seeding database (idempotent)..."
yarn db:seed

echo "[deploy] Building server..."
yarn build

echo "[deploy] Ensuring permissions..."
chown -R "$APP_USER:$APP_USER" "$SERVER_DIR"

echo "[deploy] Restarting backend service..."
if command -v systemctl >/dev/null 2>&1; then
  systemctl restart lupapp-server
else
  # Fallback to PM2 if systemd is unavailable
  if ! command -v pm2 >/dev/null 2>&1; then
    npm i -g pm2 || true
  fi
  if pm2 describe lupapp >/dev/null 2>&1; then
    pm2 reload lupapp
  else
    pm2 start /opt/lupapp/server/dist/index.js --name lupapp --time
  fi
  pm2 save || true
fi

echo "[deploy] Reloading Nginx..."
nginx -t && (systemctl reload nginx 2>/dev/null || service nginx reload || nginx -s reload)

echo "[deploy] Done."


