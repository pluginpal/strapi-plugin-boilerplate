#!/usr/bin/env bash
# Starts the required docker-compose service for DATABASE_CLIENT (postgres/mysql),
# exports connection credentials, runs the given command, then on exit drops all
# ephemeral databases (strapi_<digits>*), removes ephemeral SQLite files, and
# stops the service.
set -euo pipefail

COMPOSE_DIR="packages/dev-utils"
SERVICE=""

case "${DATABASE_CLIENT:-}" in
  postgres) SERVICE="postgres" ;;
  mysql)    SERVICE="mysql" ;;
esac

if [[ -n "$SERVICE" ]]; then
  export DATABASE_HOST="${DATABASE_HOST:-127.0.0.1}"
  export DATABASE_USERNAME="${DATABASE_USERNAME:-strapi}"
  export DATABASE_PASSWORD="${DATABASE_PASSWORD:-strapi}"
  case "$SERVICE" in
    postgres) export DATABASE_PORT="${DATABASE_PORT:-5432}" ;;
    mysql)    export DATABASE_PORT="${DATABASE_PORT:-3306}" ;;
  esac

  echo "[with-db] Starting $SERVICE..."
  docker compose --project-directory "$COMPOSE_DIR" up "$SERVICE" -d --wait

  [[ -n "${DATABASE_NAME:-}" ]] && export DATABASE_NAME
fi

cleanup() {
  case "${DATABASE_CLIENT:-sqlite}" in
    sqlite)
      echo "[with-db] Removing ephemeral SQLite databases..."
      find apps/playground/.tmp -maxdepth 1 -name 'strapi_[0-9]*.db' -delete 2>/dev/null || true
      ;;
    postgres)
      echo "[with-db] Dropping ephemeral postgres databases..."
      docker compose --project-directory "$COMPOSE_DIR" exec -T postgres sh -c \
        "psql -U '$DATABASE_USERNAME' -t -A -c \
          \"SELECT format('DROP DATABASE IF EXISTS %I;', datname) \
            FROM pg_database WHERE datname ~ '^strapi_[0-9]'\" \
        | psql -U '$DATABASE_USERNAME'" || true
      echo "[with-db] Stopping postgres..."
      docker compose --project-directory "$COMPOSE_DIR" stop postgres
      ;;
    mysql)
      echo "[with-db] Dropping ephemeral mysql databases..."
      docker compose --project-directory "$COMPOSE_DIR" exec -T mysql sh -c \
        "mysql -u root -proot -N -e \
          \"SELECT CONCAT('DROP DATABASE IF EXISTS \\\`', schema_name, '\\\`;') \
            FROM information_schema.schemata \
            WHERE schema_name REGEXP '^strapi_[0-9]'\" \
        | mysql -u root -proot" || true
      echo "[with-db] Stopping mysql..."
      docker compose --project-directory "$COMPOSE_DIR" stop mysql
      ;;
  esac
}
trap cleanup EXIT

"$@"
