# ERD Mapping (Phase 1)

This document maps the core entities, cardinality, and intent of the Prisma schema for Phase 1.

## Tenant and Access

- `Restaurant` 1..* `Branch`
- `User` *..* `Role` (via `UserRole`)
- `Role` *..* `Permission` (via `RolePermission`)
- `User` 1..* `RefreshToken`
- `User` 1..* `AuditLog`

## Customers and Catalog

- `Customer` 1..* `CustomerAddress`
- `Restaurant` 1..* `MenuCategory`
- `MenuCategory` 1..* `MenuItem`
- `MenuItem` 1..* `MenuItemModifierGroup`
- `ModifierGroup` 1..* `ModifierOption`
- `MenuItem` *..* `ModifierGroup` (via join model)

## Orders and Payments

- `Customer` 1..* `Order`
- `Restaurant` 1..* `Order`
- `Branch` 1..* `Order`
- `Order` 1..* `OrderItem`
- `OrderItem` 0..* `OrderItemModifier`
- `Order` 1..* `Payment`
- `Order` 0..1 `Invoice`
- `Invoice` 1..* `GstBreakup`
- `Order` 0..1 `Reservation`
- `Table` 1..* `Reservation`

## Inventory and Staff

- `Restaurant` 1..* `InventoryItem`
- `Branch` *..* `InventoryItem` (via `StockLevel`)
- `InventoryItem` 1..* `StockMovement`
- `Restaurant` 1..* `StaffProfile`
- `User` 0..1 `StaffProfile`

## Loyalty and Notifications

- `Customer` 1..1 `LoyaltyAccount`
- `LoyaltyAccount` 1..* `LoyaltyTransaction`
- `User` 1..* `Notification`
- `Customer` 1..* `Notification`

## Conversational and Assisted Channels

- `Restaurant` 1..* `WhatsAppConfig`
- `WhatsAppConfig` 1..* `WhatsAppSession`
- `Customer` 0..* `WhatsAppSession`
- `Restaurant` 1..* `VoiceAgentConfig`
- `VoiceAgentConfig` 1..* `AiVoiceInteraction`
- `Restaurant` 1..* `KioskConfig`
- `Branch` 0..* `KioskConfig`

## Design Notes

- Soft-delete ready fields (`isActive`, `deletedAt`) are included where needed.
- High-traffic querying supported through composite indexes on:
  - order timeline by branch/status/time
  - menu visibility by restaurant/category/isActive
  - token lookup and revocation
  - stock lookup by branch/inventory item
- Enum fields are used for lifecycle state transitions to avoid free-form drift.
- UUID primary keys are used for distributed-safe identifiers.
