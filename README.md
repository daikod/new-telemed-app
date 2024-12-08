# Telemedicine App by Daiko

A comprehensive telemedicine application built with React.js and Node.js, specifically designed for the African healthcare context.

## Overview

This telemedicine platform enables:
- Virtual medical consultations
- Appointment scheduling
- Patient record management
- Real-time video conferencing
- Integration with Nigerian healthcare facilities

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/your-username/telemedicine-app.git
cd telemedicine-app
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configurations
```

3. Start with Docker:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Detailed Documentation

For complete setup instructions, see:
- [Deployment Guide](docs/deployment-guide.md)
- [API Documentation](docs/api.md)
- [User Guide](docs/user-guide.md)

## Prerequisites

- Docker and Docker Compose
- Node.js v14+ (for local development)
- MySQL 8.0+ (for local development)
- SMTP server access
- Jitsi Meet account (for video conferencing)

## Support

For support:
1. Check the documentation
2. Create an issue
3. Contact: support@your-domain.com

## License

MIT License - see LICENSE file for details

Summary 
1. Project structure

telemedicine-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utilities
├── docker/              # Docker configurations
├── docs/               # Documentation
│   └── deployment-guide.md
├── .env                # Environment variables
├── docker-compose.yml  # Docker compose config
└── README.md          # Project overview

2. docker-compose.yml file

version: '3.8'

services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
      - REACT_APP_JITSI_DOMAIN=meet.jit.si
    depends_on:
      - backend

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=db
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - JWT_SECRET=${JWT_SECRET}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
    depends_on:
      - db
    volumes:
      - ./server:/app
      - /app/node_modules
      - ./logs:/app/logs

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=${DB_NAME}
      - MYSQL_USER=${DB_USER}
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./server/config/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"

volumes:
  mysql_data:

3. README.md and deployment-guide.md contain all necessary instructions for setup and deployment.
All files are now properly configured and ready for deployment. The application can be deployed using the instructions in the deployment guide.