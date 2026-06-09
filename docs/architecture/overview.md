# Nexovo Cafe System — Architecture Overview

This document provides visual architecture diagrams and a component map for the Nexovo Cafe System monorepo.

## 1. System Context

```mermaid
C4Context
    title Nexovo Cafe System — Context Diagram

    Person(customer, "Customer", "Orders via web/app")
    Person(staff, "Staff", "POS, KDS, admin operations")
    Person(owner, "Owner", "Analytics, branches, config")

    System(nexovo, "Nexovo Cafe System", "Unified restaurant ERP platform")

    System_Ext(payment, "Payment Gateway", "Razorpay / UPI / Cash")
    System_Ext(whatsapp, "WhatsApp Business", "Conversational ordering")
    System_Ext(cloudinary, "Cloudinary", "Menu media CDN")

    Rel(customer, nexovo, "Browse menu, place orders")
    Rel(staff, nexovo, "POS billing, KDS prep")
    Rel(owner, nexovo, "Dashboard, multi-branch")
    Rel(nexovo, payment, "Payment intents")
    Rel(nexovo, whatsapp, "Bot webhooks")
    Rel(nexovo, cloudinary, "Image uploads")
```

## 2. Container Diagram

```mermaid
flowchart TB
    subgraph Browser["Browser (localhost:3000)"]
        GP[GourmetPlatform]
        CV[Customer View]
        PV[POS View]
        KV[KDS View]
        AV[Admin View]
        SV[Super Admin View]
        GP --> CV & PV & KV & AV & SV
    end

    subgraph CustomerWeb["apps/customer-web — Next.js 15"]
        CTX[GourmetProvider Context]
        API_LIB[lib/api.ts]
        CTX --> API_LIB
    end

    subgraph AdminWeb["apps/admin-web — Next.js 15"]
        REDIR[Redirect → :3000]
    end

    subgraph API["apps/api — Express + TypeScript"]
        V1["/api/v1"]
        PUB["public/*"]
        AUTH["auth/*"]
        MOD["modules: restaurants, menu, orders, inventory"]
        RT[Socket.io]
        V1 --> PUB & AUTH & MOD
    end

    subgraph Packages["packages/"]
        CON[contracts]
        UI[ui]
    end

    subgraph Data["Data Layer"]
        PR[Prisma ORM]
        DB[(SQLite demo / PostgreSQL prod)]
        PR --> DB
    end

    Browser --> CustomerWeb
    CustomerWeb -->|REST + JWT| API
    CustomerWeb -->|WebSocket| RT
    API --> PR
    CustomerWeb --> CON
    CustomerWeb --> UI
```

## 3. Module Map

| Module | Location | Status |
|--------|----------|--------|
| Customer ordering | `apps/customer-web/components/gourmet/` | Demo complete |
| POS billing | `apps/customer-web/components/gourmet/pos-view.tsx` | Demo complete |
| Kitchen KDS | `apps/customer-web/components/gourmet/kds-view.tsx` | Demo complete |
| Admin dashboard | `apps/customer-web/components/gourmet/admin-view.tsx` | Demo complete |
| Super Admin | `apps/customer-web/components/gourmet/super-admin-view.tsx` | Demo complete |
| Public API | `apps/api/src/api/v1/modules/demo/` | Demo complete |
| Auth + RBAC | `apps/api/src/modules/auth/` | Baseline |
| Restaurants / Menu | `apps/api/src/api/v1/modules/` | Scaffold |
| Orders / Inventory | `apps/api/src/api/v1/modules/` | Scaffold |
| Realtime | `apps/api/src/realtime/` | Scaffold |
| Mobile app | `apps/mobile/` | Placeholder |

## 4. Layered Architecture

```mermaid
flowchart TB
    subgraph Presentation
        A1[Next.js Pages & Components]
        A2[Tailwind CSS + Design Tokens]
        A3[React Context State]
    end

    subgraph Application
        B1[Express Route Handlers]
        B2[Zod Validation Middleware]
        B3[RBAC Guards]
        B4[Socket.io Namespaces]
    end

    subgraph Domain
        C1[Order State Machine]
        C2[Pricing + GST Engine]
        C3[Loyalty Ledger]
        C4[Inventory Movements]
    end

    subgraph Infrastructure
        D1[Prisma Client]
        D2[JWT + Refresh Tokens]
        D3[Helmet + CORS + Rate Limit]
        D4[Audit Logging]
    end

    Presentation --> Application
    Application --> Domain
    Domain --> Infrastructure
```

## 5. Deployment Topology

```mermaid
flowchart LR
    subgraph Dev["Local Development"]
        D1[customer-web :3000]
        D2[admin-web :3001]
        D3[api :4000]
        D4[(SQLite dev.db)]
        D1 & D2 --> D3 --> D4
    end

    subgraph Prod["Production Target"]
        V1[Vercel — Web Apps]
        ALB[AWS ALB / Nginx]
        ECS[ECS Fargate — API]
        RDS[(RDS PostgreSQL)]
        REDIS[(ElastiCache Redis)]
        S3[S3 — Exports]
        CDN[Cloudinary CDN]

        V1 --> ALB --> ECS
        ECS --> RDS
        ECS --> REDIS
        ECS --> S3
        V1 --> CDN
    end
```

## 6. Security Model

| Control | Implementation |
|---------|----------------|
| Authentication | JWT access (short TTL) + refresh token with DB revocation |
| Authorization | Role-based access control via `@cafe/contracts` permissions |
| Input validation | Zod schemas on all mutating endpoints |
| Transport | Helmet headers, strict CORS allowlist |
| Rate limiting | Auth route throttling |
| Audit | Composable audit log model on operational entities |
| Tax compliance | GST breakup schema for Indian invoicing |

## 7. Data Domains

```mermaid
erDiagram
    Restaurant ||--o{ Branch : has
    Restaurant ||--o{ MenuCategory : has
    MenuCategory ||--o{ MenuItem : contains
    Customer ||--o{ Order : places
    Order ||--o{ OrderItem : contains
    Order ||--o| Invoice : generates
    Invoice ||--o{ GstBreakup : includes
    Branch ||--o{ Order : fulfills
    User }o--o{ Role : assigned
    Role }o--o{ Permission : grants
    Restaurant ||--o{ InventoryItem : stocks
    Customer ||--|| LoyaltyAccount : owns
```

See [erd-mapping.md](../database/erd-mapping.md) for full entity mapping.

## 8. Related Documents

- [System Architecture](./system-architecture.md)
- [Data Flow](./data-flow.md)
- [Implementation Phases](./implementation-phases.md)
- [Deployment Notes](../deployment/deployment-notes.md)
