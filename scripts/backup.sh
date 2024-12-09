#!/bin/bash

# Load environment variables
source .env

# Set backup directory
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup database
echo "Backing up database..."
docker-compose exec -T db mysqldump -u root -p"${DB_ROOT_PASSWORD}" "${DB_NAME}" > "${BACKUP_DIR}/db_${TIMESTAMP}.sql"

# Compress backup
gzip "${BACKUP_DIR}/db_${TIMESTAMP}.sql"

# Remove backups older than 7 days
find "${BACKUP_DIR}" -name "db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz" 