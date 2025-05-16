# Booking App

A Node.js application for managing bookings, built with Express.js and PostgreSQL.

## Prerequisites

- Node.js v22
- Docker and Docker Compose
- npm (comes with Node.js)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd platform-challenge
```

2. Install dependencies:
```bash
npm install
```

3. Start the application using Docker Compose:
```bash
docker-compose up
```

This will start both the application and PostgreSQL database containers. The application will be available at `http://localhost:3000`.

## Database Migrations

The project uses `node-pg-migrate` for database migrations. Here are the available migration commands:

- Create a new migration:
```bash
npm run migrate:create -- <migration-name>
```

- Run all pending migrations:
```bash
npm run migrate:up
```

- Rollback the last migration:
```bash
npm run migrate:down
```

## Development

- Start the application in development mode (with hot reload):
```bash
npm run dev
```

- Run tests:
```bash
npm test
```

- Lint the code:
```bash
npm run lint
```

## Environment Variables

The application uses the following environment variables:

- `POSTGRES_USER`: PostgreSQL username (default: postgres)
- `POSTGRES_PASSWORD`: PostgreSQL password (default: postgres)
- `POSTGRES_DB`: PostgreSQL database name (default: booking_app)
- `PORT`: Application port (default: 3000)

These variables are already configured in the `docker-compose.yml` file.

## Project Structure

```
.
├── src/              # Source code
├── migrations/       # Database migrations
├── init-scripts/     # Database initialization scripts
├── docker-compose.yml
└── package.json
```

## API Documentation

[Add API documentation here]

## Contributing

[Add contribution guidelines here]

## License

[Add license information here]