# Telemedicine App

A comprehensive telemedicine application built with React.js and Node.js, designed for the African healthcare context.

## Features

### Core Features
- User authentication and authorization
- Appointment scheduling and management
- Video consultations via Jitsi Meet
- Patient records management
- Doctor profiles and availability
- Hospital directory
- Email notifications

### Technical Stack
- Frontend: React.js with Material-UI and TailwindCSS
- Backend: Node.js with Express
- Database: MySQL
- Video: Jitsi Meet
- Containerization: Docker & Docker Compose
- Authentication: JWT
- Email: SMTP via Nodemailer

## Prerequisites

Before installation, ensure you have:
- Docker and Docker Compose installed
- Node.js v14+ (for development)
- Git
- SMTP server access
- Domain name (for production)

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

3. Start the application:
```bash
# Create required directories
mkdir -p {logs,backups,data/mysql}
mkdir -p docker/jitsi/{web,prosody}/config
chmod -R 750 docker/jitsi

# Start services
docker-compose up -d
```

4. Access the application:
- Web App: http://localhost:3000
- API Server: http://localhost:5000
- Video Conference: https://localhost:8443

## Development

1. Install dependencies:
```bash
# Frontend dependencies
cd client && npm install

# Backend dependencies
cd ../server && npm install
```

2. Start development servers:
```bash
# Start backend
cd server && npm run dev

# Start frontend
cd client && npm start
```

## Directory Structure
```
telemedicine-app/
├── client/                 # React frontend
├── server/                # Node.js backend
├── docker/               # Docker configurations
├── scripts/             # Deployment scripts
├── docs/                # Documentation
└── README.md
```

## Available Scripts

- `scripts/deploy.sh`: Deploy the application
- `scripts/backup.sh`: Backup the database
- `scripts/healthcheck.sh`: Check services health

## Maintenance

### Backups
```bash
# Create backup
./scripts/backup.sh
```

### Health Checks
```bash
# Check all services
./scripts/healthcheck.sh
```

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f [service-name]
```

## Troubleshooting

Common issues and solutions:

1. Database Connection Issues:
   - Check if MySQL container is running
   - Verify database credentials in .env
   - Check database logs

2. Email Configuration:
   - Verify SMTP settings
   - Check email service logs
   - Test email connectivity

3. Video Conference Issues:
   - Check Jitsi service status
   - Verify SSL certificates
   - Check browser permissions

## Support

For support:
1. Review the documentation
2. Check common issues in deployment guide
3. Create an issue
4. Contact: support@your-domain.com

## License

MIT License - see LICENSE file for details

