# Deployment Notes — Nexovo Cafe System

## Local Development (Demo — SQLite)

1. Copy API environment:
   - `cp apps/api/.env.example apps/api/.env`
2. Install:
   - `npm install`
3. Push schema and seed demo data:
   - `npm run prisma:push -w @cafe/api`
   - `npm run prisma:seed`
4. Configure customer web (optional — defaults to localhost:4000):
   - `apps/customer-web/.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:4000`
5. Start all services:
   - `npm run dev:all`

| Service | URL |
|---------|-----|
| Nexovo Cafe System | http://localhost:3000 |
| Admin redirect | http://localhost:3001 |
| API + Swagger | http://localhost:4000/api/docs |

## Local Development (PostgreSQL)

1. Start local infra:
   - `docker compose up -d postgres redis`
2. Set `DATABASE_URL` in `apps/api/.env` to PostgreSQL connection string
3. Switch `provider` to `postgresql` in `apps/api/prisma/schema.prisma`
4. Generate client and migrate:
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
   - `npm run prisma:seed`
5. Start API:
   - `npm run dev:api`

## Dockerized API

- Build and run:
  - `docker compose up --build api`
- API available at `http://localhost:4000`
- Swagger at `http://localhost:4000/docs`

## Production Recommendation

- API containers on AWS ECS/Fargate with autoscaling.
- PostgreSQL on AWS RDS with Multi-AZ + automated backups.
- Redis on ElastiCache for queueing/cache/pubsub.
- Admin/customer web deployed on Vercel.
- Nginx or ALB at edge with TLS termination and WAF.

## CI/CD Baseline

- GitHub workflow runs install, Prisma client generation, lint, tests, and build.
- Add secrets for production deploy jobs in a later phase:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `DATABASE_URL`

## Known TODOs Before Go-Live

- Add branch-level row access guards.
- Add DB-backed idempotency for payment/order callbacks.
- Add structured logging and distributed tracing.
- Add SAST/DAST and dependency scanning gates.
