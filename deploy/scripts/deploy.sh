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

echo "[deploy] Building server..."
yarn build

echo "[deploy] Ensuring permissions..."
chown -R "$APP_USER:$APP_USER" "$SERVER_DIR"

echo "[deploy] Restarting backend service..."
systemctl restart lupapp-server

echo "[deploy] Reloading Nginx..."
nginx -t && systemctl reload nginx

echo "[deploy] Done."


