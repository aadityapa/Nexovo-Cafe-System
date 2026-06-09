# Nexovo Cafe System — System Architecture

## 1) Platform Scope

**Nexovo Cafe System** is an enterprise restaurant & cafe management ecosystem covering:

- Customer web ordering (Delivery / Pickup / Dine-in)
- Unified platform with POS, KDS, Admin, and Super Admin role switcher
- Inventory and procurement operations (schema-ready)
- CRM and loyalty (schema-ready)
- GST invoicing and payment reconciliation (INR)
- WhatsApp ordering and AI voice ordering (schema-ready)
- Kiosk-assisted in-store ordering (schema-ready)
- Multi-branch + white-label readiness

**Brand:** Nexovo · **Version:** Enterprise v5.0 · **Demo slug:** `nexovo-cafe`

## 2) Monorepo Design

- `apps/api`: Node.js + Express + TypeScript backend, Prisma ORM, JWT auth, RBAC, Swagger, Socket.io
- `apps/customer-web`: Next.js 15 unified platform — Customer, POS, KDS, Admin, Super Admin, Dev Suite
- `apps/admin-web`: Next.js 15 redirect to unified platform at `:3000`
- `apps/mobile`: Expo placeholder for future build
- `packages/contracts`: shared role/permission and typed contracts
- `packages/ui`: shared design-system components (shadcn/Tailwind-ready)
- `docs/*`: architecture, data model, deployment, phased roadmap

## 3) Backend Runtime Topology

- API entry point: versioned REST routes at `/api/v1`
- Security baseline:
  - `helmet` hardening
  - strict CORS allowlist
  - auth route rate limiting
  - zod-based request validation middleware
- Authentication:
  - access JWT (short TTL)
  - refresh JWT with DB-backed revocation records
- Authorization:
  - role + permission mapping via RBAC guard middleware
- OpenAPI docs:
  - Swagger UI at `/docs`
- Realtime:
  - Socket.io order namespace `/orders`
  - Socket.io kitchen namespace `/kitchen`

## 4) Data Architecture

**Demo:** SQLite (`apps/api/prisma/dev.db`) · **Production:** PostgreSQL + Prisma

Enterprise baseline entities:

- Identity: users, roles, permissions, refresh tokens, audit logs
- Multi-tenant structure: restaurants, branches, staff profile bindings
- Ordering: categories, menu items, orders, order items, kitchen tickets
- Finance: payments, invoices, GST breakups
- Operations: inventory items, stock levels, inventory movement, recipe mapping
- Growth and engagement: loyalty accounts/ledger, notifications
- Conversational channels: WhatsApp configs/sessions, AI voice configs/interactions
- Assisted in-store: kiosk configs

Design conventions:

- UUID primary keys
- lifecycle enums for transactional safety
- soft delete fields for key business tables
- indexed high-traffic timelines and lookups
- audit timestamps on all operational entities

## 5) Deployment Targets

- API: AWS ECS/Fargate (or EC2 + Docker + Nginx)
- Web apps: Vercel (admin/customer)
- Database: AWS RDS PostgreSQL
- Cache/Event bus: Redis (ElastiCache in production)
- Media: Cloudinary
- Artifacts/exports: S3

## 6) Security and Compliance Posture

- JWT secrets and DB URL managed via environment variables/secret manager
- password hashing with configurable bcrypt rounds
- permission-first API gating for privileged actions
- composable audit logging model for compliance trails
- GST-capable invoice + tax breakup schema for Indian tax workflows

## 7) Scalability Path

Current state is a modular monolith designed for production starter velocity. Modules can be extracted into dedicated services without schema redesign:

- Order orchestration + kitchen sync service
- Payment orchestration service
- Notification/engagement service
- Inventory intelligence service
- AI conversational service
