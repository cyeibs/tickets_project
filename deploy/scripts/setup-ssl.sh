#!/usr/bin/env bash
set -euo pipefail

DOMAIN=${1:-loop-app.ru}
EMAIL=${2:-admin@${1:-loop-app.ru}}

echo "[ssl] Installing certbot..."
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get install -y certbot python3-certbot-nginx

echo "[ssl] Preparing webroot for http-01..."
mkdir -p /var/www/certbot
chown -R www-data:www-data /var/www/certbot

echo "[ssl] Ensuring nginx is running and serving /.well-known/acme-challenge..."
# Install HTTP-only site first to allow http-01 challenge
if [ -f /opt/lupapp/deploy/nginx/lupapp.conf ]; then
  install -m 0644 /opt/lupapp/deploy/nginx/lupapp.conf /etc/nginx/sites-available/lupapp.conf
  ln -sf /etc/nginx/sites-available/lupapp.conf /etc/nginx/sites-enabled/lupapp.conf
  if [ -f /etc/nginx/sites-enabled/lupapp-ssl.conf ]; then rm -f /etc/nginx/sites-enabled/lupapp-ssl.conf; fi
fi
nginx -t && systemctl restart nginx

echo "[ssl] Requesting certificate for $DOMAIN ..."
certbot certonly --webroot -w /var/www/certbot -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "$EMAIL"

echo "[ssl] Installing recommended SSL options (if missing)..."
if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then
  wget -O /etc/letsencrypt/options-ssl-nginx.conf https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-django/nginx/options-ssl-nginx.conf || true
fi
if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
  openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
fi

echo "[ssl] Switching nginx to SSL config..."
if [ -f /opt/lupapp/deploy/nginx/lupapp-ssl.conf ]; then
  install -m 0644 /opt/lupapp/deploy/nginx/lupapp-ssl.conf /etc/nginx/sites-available/lupapp-ssl.conf
  ln -sf /etc/nginx/sites-available/lupapp-ssl.conf /etc/nginx/sites-enabled/lupapp-ssl.conf
fi
nginx -t && systemctl reload nginx

echo "[ssl] Setting up renewal timer (certbot.timer should be enabled by default)."
systemctl enable --now certbot.timer || true

echo "[ssl] Done. Certificates installed for $DOMAIN"


