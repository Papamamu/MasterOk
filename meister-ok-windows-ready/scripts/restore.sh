#!/bin/sh
set -eu
if [ -z "${BACKUP_NAME:-}" ] || [ ! -f "/backups/$BACKUP_NAME/meister.db" ]; then
  echo "Set BACKUP_NAME to a directory listed below:" >&2
  ls -1 /backups >&2
  exit 1
fi
cp "/backups/$BACKUP_NAME/meister.db" /data/meister.db
rm -rf /app/public/uploads/*
cp -R "/backups/$BACKUP_NAME/uploads/." /app/public/uploads/
echo "Restored backup $BACKUP_NAME"
