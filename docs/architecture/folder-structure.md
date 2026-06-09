# Folder Structure

## Top Level

- `apps/`: Deployable applications
- `packages/`: Shared packages used by multiple apps
- `docs/`: Architecture and database documentation

## apps

- `apps/api`: Backend service with auth and data access foundations
- `apps/web`: Next.js web app placeholder (customer/admin/super-admin)
- `apps/mobile`: Expo app placeholder (customer/staff)

## packages

- `packages/contracts`: Shared role/permission enums and auth contract types

## docs

- `docs/architecture/phase-1-architecture.md`: System architecture and deployment design
- `docs/architecture/folder-structure.md`: Monorepo organization rationale
- `docs/database/erd-mapping.md`: Entity relationship mapping notes
