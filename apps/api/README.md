# API Service

Express + TypeScript backend with modular layered architecture.

## Structure

- `src/modules/*`: Domain modules (routes, controllers, services, repositories)
- `src/middlewares`: Cross-cutting auth, validation, error, and RBAC middleware
- `src/config`: Environment, Prisma client, and OpenAPI config
- `src/routes`: API composition layer
- `src/utils`: Stateless helper utilities
- `prisma/schema.prisma`: PostgreSQL schema for platform domains

## Auth Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Swagger UI:

- `GET /api/docs`
