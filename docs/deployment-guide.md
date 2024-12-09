# Telemedicine App Deployment Guide

## Table of Contents
1. Prerequisites
2. Initial Setup
3. Configuration
4. Database Setup
5. Application Deployment
6. Production Setup
7. Maintenance
8. Troubleshooting

## 1. Prerequisites

### System Requirements
- Ubuntu 20.04 LTS or higher
- 4GB RAM minimum (8GB recommended)
- 20GB storage minimum
- Domain name with DNS configured
- SSL certificates
- SMTP server access

### Required Software
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    git \
    nginx \
    certbot \
    python3-certbot-nginx
```

## 2. Initial Setup

### Clone Repository
```bash
git clone https://github.com/your-username/telemedicine-app.git
cd telemedicine-app
```

### Directory Structure
```bash
# Create required directories
mkdir -p {logs,backups,data/mysql}
mkdir -p docker/jitsi/{web,prosody}/config
chmod -R 750 docker/jitsi
```

## 3. Configuration

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Generate secure passwords
export DB_PASSWORD=$(openssl rand -hex 16)
export JWT_SECRET=$(openssl rand -hex 32)
export JITSI_APP_ID=$(openssl rand -hex 16)
export JITSI_APP_SECRET=$(openssl rand -hex 32)
```

### Update Environment Variables
Edit .env file with:
- Database credentials
- SMTP settings
- JWT secret
- Jitsi configuration
- Domain settings

## 4. Database Setup

### Initialize Database
```bash
# Start database
docker-compose up -d db

# Wait for database
until docker-compose exec db mysqladmin ping -h"localhost" --silent; do
    sleep 2
done
```

## 5. Application Deployment

### Development Deployment
```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Production Deployment
```bash
# Deploy with production settings
./scripts/deploy.sh
```

## 6. Maintenance

### Regular Backups
```bash
# Setup automatic backups
(crontab -l 2>/dev/null; echo "0 0 * * * /path/to/backup.sh") | crontab -
```

### Monitoring
```bash
# Check service health
./scripts/healthcheck.sh

# Monitor logs
docker-compose logs -f
```

### Updates
```bash
# Update application
git pull origin main
docker-compose down
docker-compose up -d --build
```

## 7. Security Considerations

### Firewall Configuration
```bash
# Configure firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8443/tcp
sudo ufw enable
```

### SSL Certificates
```bash
# Install certificates
sudo certbot --nginx -d your-domain.com
```

## 8. Troubleshooting

### Common Issues

1. Database Connection Errors:
```bash
# Check database logs
docker-compose logs db

# Verify connection
docker-compose exec db mysql -u root -p -e "SELECT 1;"
```

2. Email Issues:
```bash
# Test SMTP connection
docker-compose exec backend npm run test:email
```

3. Container Issues:
```bash
# Restart services
docker-compose restart

# Rebuild specific service
docker-compose up -d --build [service-name]
```

### Logs

Access logs for debugging:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs [service-name]

# Follow logs
docker-compose logs -f
```

## Support

For additional support:
1. Check the documentation
2. Review logs
3. Create an issue
4. Contact support team

## Security Notes

1. Always change default passwords
2. Keep Docker and dependencies updated
3. Regularly backup database
4. Monitor system logs
5. Use SSL/TLS in production
6. Implement rate limiting
7. Enable firewall rules
``` 