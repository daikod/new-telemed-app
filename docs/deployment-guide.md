# Deployment Guide

## Table of Contents
1. Prerequisites
2. Initial Setup
3. Configuration
4. Database Setup
5. Application Deployment
6. SSL Configuration
7. Production Setup
8. Maintenance
9. Video Conferencing Setup

## 1. Prerequisites

### System Requirements
- Ubuntu 20.04 LTS or higher
- 4GB RAM minimum
- 20GB storage minimum
- Domain name
- SSL certificate

### Required Software
- Docker Engine
- Docker Compose
- Git
- SMTP server access

## 2. Initial Setup

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

```bash
# Clone repository
git clone https://github.com/your-username/telemedicine-app.git
cd telemedicine-app

# Create environment file
cp .env.example .env

# Configure environment variables
nano .env
```

## 4. Database Setup

```bash
# Create data directory
mkdir -p data/mysql

# Set permissions
sudo chown -R 999:999 data/mysql

# Initialize database
docker-compose up -d db

# Verify database
docker-compose exec db mysql -u root -p${DB_ROOT_PASSWORD} -e "SHOW DATABASES;"
```

## 5. Application Deployment

```bash
# Build and start services
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

## 6. SSL Configuration

```bash
# Install Certbot
sudo apt install -y certbot

# Obtain certificate
sudo certbot certonly --standalone -d your-domain.com

# Configure SSL
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./docker/nginx/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./docker/nginx/
```

## 7. Production Setup

```bash
# Configure firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Start production services
docker-compose -f docker-compose.prod.yml up -d
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
docker-compose logs -f app
```

For additional support, please contact the development team. 

## 9. Video Conferencing Setup

### Jitsi Configuration

1. Create required directories:
```bash
mkdir -p docker/jitsi/{web,prosody,jicofo,jvb}/config
chmod -R 750 docker/jitsi
```

2. Generate secrets:
```bash
# Generate random secrets
export JITSI_APP_ID=$(openssl rand -hex 16)
export JITSI_APP_SECRET=$(openssl rand -hex 32)
export JICOFO_AUTH_PASSWORD=$(openssl rand -hex 16)
export JVB_AUTH_PASSWORD=$(openssl rand -hex 16)

# Add to .env file
cat >> .env << EOL

# Jitsi Configuration
JITSI_APP_ID=${JITSI_APP_ID}
JITSI_APP_SECRET=${JITSI_APP_SECRET}
JICOFO_AUTH_PASSWORD=${JICOFO_AUTH_PASSWORD}
JVB_AUTH_PASSWORD=${JVB_AUTH_PASSWORD}
EOL
```

3. Configure SSL for Jitsi:
```bash
# Generate certificate for Jitsi domain
sudo certbot certonly --standalone -d ${JITSI_DOMAIN}

# Copy certificates
sudo cp /etc/letsencrypt/live/${JITSI_DOMAIN}/fullchain.pem docker/jitsi/web/
sudo cp /etc/letsencrypt/live/${JITSI_DOMAIN}/privkey.pem docker/jitsi/web/
sudo chown -R 999:999 docker/jitsi/web/
```

4. Configure firewall for Jitsi:
```bash
sudo ufw allow 10000/udp  # JVB port
sudo ufw allow 4443/tcp   # Fallback port
```

5. Start Jitsi services:
```bash
docker-compose up -d jitsi-web jitsi-prosody jitsi-jicofo jitsi-jvb
```

6. Verify Jitsi deployment:
```bash
# Check all services are running
docker-compose ps

# Check Jitsi web interface
curl -k https://localhost:8443

# Check logs
docker-compose logs jitsi-web
docker-compose logs jitsi-prosody
``` 