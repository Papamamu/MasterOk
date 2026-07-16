#!/bin/sh
set -eu

if [ "${#AUTH_SECRET}" -lt 32 ]; then
  echo "AUTH_SECRET must contain at least 32 characters" >&2
  exit 1
fi
if [ -z "${ADMIN_EMAIL:-}" ] || [ -z "${ADMIN_PASSWORD:-}" ] || [ "${#ADMIN_PASSWORD}" -lt 12 ]; then
  echo "ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters) are required" >&2
  exit 1
fi

mkdir -p /data /app/public/uploads /backups
node node_modules/prisma/build/index.js migrate deploy
node node_modules/tsx/dist/cli.mjs prisma/seed.ts
exec node node_modules/next/dist/bin/next start
