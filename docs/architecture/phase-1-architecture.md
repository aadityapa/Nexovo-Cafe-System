# Phase 1 Architecture

## High-Level System Architecture

The platform is designed as a modular, multi-tenant system with a shared identity and authorization core.

- Client surfaces:
  - Customer web/mobile app
  - Admin web panel
  - POS terminal app
  - KDS (kitchen display system)
  - Staff operations app
  - Super-admin control plane
- API layer:
  - `apps/api` modular monolith (Phase 1) with bounded modules
  - REST-first with OpenAPI
- Data and state:
  - PostgreSQL (transactional source of truth)
  - Prisma for typed data access
  - Cloudinary for media assets
  - S3 for exports, reports, and archival files

This Phase 1 implementation uses a modular monolith to reduce deployment complexity while preserving future extraction paths to microservices.

## Service Boundaries and Domain Modules

### Identity and Access

- Authentication (register, login, refresh, logout, me)
- Role-based access control (RBAC)
- Permission matrix by module/action scope
- Refresh token lifecycle and revocation

### Tenant and Organization

- Super-admin platform tenant controls
- Restaurant groups and individual restaurants
- Branches, branch-level configs, and timezone-aware operations

### Customer and Ordering

- Customer profile, addresses, and preferences
- Menu catalog, categories, modifiers, combos
- Cart and order lifecycle
- Reservation and table assignment
- QR order entry channel

### Operations

- POS order capture
- KDS production flow
- Staff management and scheduling foundations
- Inventory stock and movement

### Financial and Growth

- Payment intents and status transitions
- Accounting export bridge
- Loyalty points, tiering, and ledger
- Notification channels (email, SMS, push, in-app)

### Delivery and Integrations

- Delivery partner abstraction layer
- Webhook ingest boundaries for third-party status updates

## Order Lifecycle Data Flow

1. Customer creates cart from menu and submits order.
2. API validates availability, branch status, table context, and pricing snapshot.
3. Order enters `PENDING` with immutable line snapshot.
4. Payment service records initiation and gateway references.
5. On successful payment authorization/capture, order transitions to `CONFIRMED`.
6. KDS receives kitchen tickets, updates prep states (`ACCEPTED`, `PREPARING`, `READY`).
7. POS/staff updates service fulfillment (`OUT_FOR_DELIVERY`, `COMPLETED`).
8. Loyalty ledger applies points after completion.
9. Notification module emits customer/staff events at major transitions.
10. Audit log captures actor, action, resource, and before/after summaries.

## Security Architecture

- Authentication:
  - Access token (short-lived JWT)
  - Refresh token (long-lived JWT + DB-backed token record and revocation)
- Authorization:
  - RBAC via role-permission mapping
  - Branch and restaurant scope checks (Phase 2 enrichment)
- Secret management:
  - Environment-backed secrets with strict separation by environment
- Data protection:
  - Password hashing with bcrypt
  - TLS enforced at edge and service boundaries
  - PII minimization and masked logging
- Abuse prevention:
  - Rate limiting for auth endpoints and global requests
  - Secure HTTP headers with Helmet
  - CORS allowlist and credential discipline
  - Request payload size limit + strict validation
- Auditability:
  - Audit log model for privileged actions and auth events
  - Refresh token revocation tracking and metadata

## Deployment Topology (AWS + Vercel + S3 + Cloudinary)

- Vercel:
  - Hosts web frontends (customer/admin/super-admin) with edge acceleration
- AWS:
  - API deployed on ECS/Fargate (or EKS) behind ALB
  - RDS PostgreSQL (multi-AZ for production)
  - ElastiCache Redis reserved for session/cache/event fanout (Phase 2+)
  - S3 for exports, documents, and data snapshots
- Cloudinary:
  - Menu/media assets, dynamic transformations, delivery optimization
- Networking and edge:
  - WAF + rate limits + TLS termination
  - Private subnets for database and internal services
- Observability:
  - Centralized logs + traces + metrics
  - Alerting on auth failures, token abuse, and order pipeline latency
