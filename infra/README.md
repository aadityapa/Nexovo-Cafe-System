# Infrastructure Baseline

- `docker-compose.yml` at root provides local API/PostgreSQL/Redis stack.
- `apps/api/Dockerfile` provides production-ready API image baseline.
- Add IaC in upcoming phases (`terraform` or `cdk`) for AWS networking, ECS, RDS, ElastiCache, and secrets.
