#!/bin/bash

# Load environment variables
source .env

# Check frontend
echo "Checking frontend..."
curl -f http://localhost:3000 || exit 1

# Check backend
echo "Checking backend API..."
curl -f http://localhost:5000/api/health || exit 1

# Check database
echo "Checking database connection..."
docker-compose exec -T db mysqladmin -u root -p${DB_ROOT_PASSWORD} ping || exit 1

# Check Jitsi
echo "Checking Jitsi service..."
curl -f -k https://localhost:8443 || exit 1

echo "All services are healthy!" 