# Telemedicine App

A comprehensive telemedicine application built with React.js and Node.js, designed for the African healthcare context.

## Overview

This telemedicine platform provides:
- Virtual medical consultations with integrated video conferencing
- Secure appointment scheduling and management
- Patient record management
- Integration with Nigerian healthcare facilities
- Real-time notifications and messaging

## Features

### Core Features
- User authentication and authorization
- Appointment management
- Video consultations
- Patient records
- Doctor profiles
- Hospital directory

### Technical Features
- React.js frontend
- Node.js backend
- MySQL database
- Docker containerization
- Integrated Jitsi Meet for video calls
- JWT authentication
- Real-time notifications

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-username/telemedicine-app.git
cd telemedicine-app
```

2. Set up environment:
```bash
cp .env.example .env
# Edit .env with your configurations
```

3. Create required directories:
```bash
mkdir -p docker/jitsi/{web,prosody,jicofo,jvb}/config
chmod -R 750 docker/jitsi
```

4. Start the application:
```bash
docker-compose up -d
```

5. Access the services:
- Web Application: http://localhost:3000
- API Server: http://localhost:5000
- Video Conference: https://localhost:8443

## Prerequisites

- Docker and Docker Compose
- Node.js v14+ (for development)
- MySQL 8.0+ (for development)
- SMTP server access
- Domain name and SSL certificate (for production)

## Development

See [Deployment Guide](docs/deployment-guide.md) for detailed setup instructions.

## Support

For support:
1. Review the documentation
2. Create an issue
3. Contact: support@your-domain.com

## License

MIT License - see LICENSE file for details

