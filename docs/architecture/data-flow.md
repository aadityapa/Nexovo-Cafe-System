# Data Flow — Nexovo Cafe System

Sequence diagrams and event flows for core platform operations.

## 1. Application Bootstrap

When the customer web app loads, `GourmetProvider` fetches bootstrap data and orders from the API.

```mermaid
sequenceDiagram
    participant Browser
    participant GourmetProvider
    participant API as API :4000
    participant DB as Prisma / DB

    Browser->>GourmetProvider: Mount (useEffect)
    GourmetProvider->>API: GET /api/v1/public/bootstrap
    API->>DB: Query restaurant, branches, menu
    DB-->>API: Bootstrap payload
    API-->>GourmetProvider: Restaurant + menu + branches
    GourmetProvider->>API: GET /api/v1/public/orders
    API->>DB: Query active orders
    DB-->>API: Order list
    API-->>GourmetProvider: Orders[]
    GourmetProvider-->>Browser: Render platform

    Note over GourmetProvider,API: On fetch failure, falls back to demo data (no crash)
```

## 2. Customer Order Placement

```mermaid
sequenceDiagram
    participant Customer
    participant Cart as Cart UI
    participant API as API :4000
    participant DB as Prisma / DB

    Customer->>Cart: Add items, apply coupon
    Customer->>Cart: Checkout (Delivery/Pickup/Dine-in)
    Cart->>API: POST /api/v1/public/orders
    API->>API: Validate items, pricing, GST
    API->>DB: Create Order + OrderItems
    DB-->>API: Order NX-XXXX
    API-->>Cart: Order confirmation
    Cart-->>Customer: Success toast + order ID
```

## 3. Order Status Lifecycle

Orders progress through a defined state machine shared across POS, KDS, and customer views.

```mermaid
stateDiagram-v2
    [*] --> PLACED
    PLACED --> CONFIRMED : POS confirms
    CONFIRMED --> PREPARING : KDS starts prep
    PREPARING --> READY : Kitchen marks ready
    READY --> COMPLETED : POS delivers / pickup
    PLACED --> CANCELLED : Cancel
    CONFIRMED --> CANCELLED : Cancel
```

```mermaid
sequenceDiagram
    participant KDS
    participant API as API :4000
    participant DB as Prisma / DB
    participant POS
    participant Customer

    KDS->>API: PATCH /orders/:id/status { PREPARING }
    API->>DB: Update order status
    DB-->>API: Updated order
    API-->>KDS: 200 OK
    API--)POS: Socket.io order:updated
    API--)Customer: Socket.io order:updated
    KDS->>API: PATCH { READY }
    POS->>API: PATCH { COMPLETED }
```

## 4. Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as API :4000
    participant DB as Prisma / DB

    Client->>API: POST /api/v1/auth/login { email, password }
    API->>DB: Find user + verify bcrypt hash
    DB-->>API: User + roles
    API->>DB: Store refresh token hash
    API-->>Client: { accessToken, refreshToken, user }
    Client->>API: GET /api/v1/auth/me (Authorization: Bearer)
    API-->>Client: User profile + permissions

    Note over Client,API: Refresh via POST /api/v1/auth/refresh
    Note over Client,API: Logout revokes refresh token in DB
```

## 5. Realtime Events (Socket.io)

| Namespace | Event | Payload | Consumers |
|-----------|-------|---------|-----------|
| `/orders` | `order:created` | Order object | KDS, Admin |
| `/orders` | `order:updated` | Order + status | POS, KDS, Customer |
| `/kitchen` | `ticket:ready` | Ticket ID | POS, Customer |

Scaffolding lives in `apps/api/src/realtime/`. Demo mode uses REST polling with graceful Socket.io upgrade path.

## 6. Analytics Dashboard

```mermaid
sequenceDiagram
    participant Admin
    participant API as API :4000
    participant DB as Prisma / DB

    Admin->>API: GET /api/v1/public/analytics
    API->>DB: Aggregate orders, revenue, top items
    DB-->>API: Metrics bundle
    API-->>Admin: Revenue, order count, avg ticket, trends
```

## 7. Offline Resilience

The customer web client implements safe fetch wrappers:

1. `fetchBootstrap()` — returns demo menu if API unreachable
2. `fetchOrders()` — returns `[]` on network failure
3. `GourmetProvider` — catches errors, shows toast, continues with local state

This prevents the "Failed to fetch" runtime crash when the API is not running.

## Related Documents

- [Architecture Overview](./overview.md)
- [System Architecture](./system-architecture.md)
- [ERD Mapping](../database/erd-mapping.md)
