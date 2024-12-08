# Telemedicine App Deployment Guide

## Table of Contents
1. Prerequisites
2. Installation
3. Configuration
4. Database Setup
5. Application Deployment
6. Testing
7. Production Setup
8. Maintenance

## 1. Prerequisites

### System Requirements
- Ubuntu 20.04 LTS or higher
- 4GB RAM minimum
- 20GB storage minimum
- Root or sudo access
- Domain name (for production)

### Required Software
- Docker Engine
- Docker Compose
- Git
- SMTP server access

## 2. Installation

### System Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

## 3. Configuration

### Environment Setup
```bash
# Clone repository
git clone https://github.com/your-username/telemedicine-app.git
cd telemedicine-app

# Create environment file
cp .env.example .env

# Edit .env with your configurations
nano .env
```

Required environment variables:
```env
# Database
DB_HOST=db
DB_USER=telemedicine_user
DB_PASSWORD=secure_password
DB_NAME=telemedicine_db
DB_ROOT_PASSWORD=root_secure_password

# JWT
JWT_SECRET=your_secure_jwt_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_app_password

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 4. Database Setup

### Initialize Database
```bash
# Create data directory
mkdir -p data/mysql

# Set permissions
sudo chown -R 999:999 data/mysql

# Start database container
docker-compose up -d db

# Wait for database to be ready
until docker-compose exec db mysqladmin ping -h"localhost" --silent; do
    echo "Waiting for database..."
    sleep 2
done
```

## 5. Application Deployment

### Deploy Application
```bash
# Build and start all services
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

## 6. Testing

### Verify Deployment
```bash
# Test frontend
curl http://localhost:3000

# Test backend
curl http://localhost:5000/api/health

# Test database connection
docker-compose exec db mysqladmin -u root -p${DB_ROOT_PASSWORD} status
```

## 7. Production Setup

### SSL Configuration
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Test renewal
sudo certbot renew --dry-run
```

### Security Setup
```bash
# Configure firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## 8. Maintenance

### Backup Database
```bash
# Create backup
docker-compose exec db mysqldump -u root -p${DB_ROOT_PASSWORD} telemedicine_db > backup.sql

# Restore backup
docker-compose exec -T db mysql -u root -p${DB_ROOT_PASSWORD} telemedicine_db < backup.sql
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Monitor Logs
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
```

For additional support or troubleshooting, please refer to the documentation or contact the development team.


