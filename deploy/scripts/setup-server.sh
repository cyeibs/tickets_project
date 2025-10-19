#!/usr/bin/env bash
set -euo pipefail

# Idempotent one-time server setup for Ubuntu 24.04
# - Installs Node.js 22, Yarn (via corepack), Nginx, and PostgreSQL
# - Creates app user and directories
# - Installs Nginx site and systemd service (if present in /opt/lupapp/deploy)

APP_USER="lupapp"
APP_DIR="/opt/lupapp"
SERVER_DIR="$APP_DIR/server"
WEB_ROOT="/var/www/lupapp"

echo "[setup] Updating apt and installing base packages..."
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get install -y curl ca-certificates gnupg build-essential nginx postgresql postgresql-contrib

if ! command -v node >/dev/null 2>&1; then
  echo "[setup] Installing Node.js 22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs
fi

echo "[setup] Enabling corepack (Yarn)..."
corepack enable || true
corepack prepare yarn@1.22.22 --activate || true

if ! id -u "$APP_USER" >/dev/null 2>&1; then
  echo "[setup] Creating user $APP_USER..."
  useradd -m -d "$APP_DIR" -s /bin/bash "$APP_USER"
fi

echo "[setup] Creating directories..."
mkdir -p "$SERVER_DIR" "$WEB_ROOT" "$APP_DIR/deploy"
chown -R "$APP_USER:$APP_USER" "$APP_DIR" "$WEB_ROOT"

# Nginx site
if [ -f "$APP_DIR/deploy/nginx/lupapp.conf" ]; then
  echo "[setup] Installing Nginx site config..."
  install -m 0644 "$APP_DIR/deploy/nginx/lupapp.conf" /etc/nginx/sites-available/lupapp.conf
  ln -sf /etc/nginx/sites-available/lupapp.conf /etc/nginx/sites-enabled/lupapp.conf
  if [ -f /etc/nginx/sites-enabled/default ]; then rm -f /etc/nginx/sites-enabled/default; fi
  nginx -t && systemctl restart nginx
fi

# systemd service
if [ -f "$APP_DIR/deploy/systemd/lupapp-server.service" ]; then
  echo "[setup] Installing systemd service..."
  install -m 0644 "$APP_DIR/deploy/systemd/lupapp-server.service" /etc/systemd/system/lupapp-server.service
  systemctl daemon-reload
  systemctl enable lupapp-server
fi

# PostgreSQL: ensure database exists; set a password for 'postgres' role (change in production!)
echo "[setup] Ensuring PostgreSQL database exists..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'lupapp'" | grep -q 1 || sudo -u postgres createdb lupapp
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';" >/dev/null 2>&1 || true

echo "[setup] Done. Place your env file at $SERVER_DIR/.env and run deploy script."


