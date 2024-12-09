#!/bin/bash

# Stop on any error
set -e

# Load environment variables
source .env

echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Create necessary directories
mkdir -p {logs,backups,data/mysql}
mkdir -p docker/jitsi/{web,prosody}/config
chmod -R 750 docker/jitsi

# Stop existing services
docker-compose down

# Build and start services
docker-compose up -d --build

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Run health checks
./scripts/healthcheck.sh

# Check logs for any errors
docker-compose logs --tail=100

echo "Deployment completed successfully!" 