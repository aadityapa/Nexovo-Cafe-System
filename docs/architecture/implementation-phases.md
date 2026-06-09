# 18-Phase Delivery Plan

This plan aligns enterprise implementation with deployable increments.

## Phase 1 - Foundation and Security Baseline
- Monorepo setup, API skeleton, Prisma base schema, auth + RBAC baseline, CI/CD skeleton, Docker local stack.

## Phase 2 - Restaurant and Branch Governance
- Restaurant onboarding, branch management, timezone and operating windows, branch-scoped authorization checks.

## Phase 3 - Menu and Catalog Engine
- Categories, items, add-ons/modifiers, combos, media attachments, versioned price snapshots.

## Phase 4 - Order Core and Cart Rules
- Cart service, pricing engine, taxes, discounts, order placement and state machine.

## Phase 5 - POS Workflows
- Cashier flow, dine-in/takeaway, split/merge bills, offline-safe queueing.

## Phase 6 - Kitchen Display System
- Kitchen stations, ticketing, prep SLAs, item-level statuses, pass counter and completion sync.

## Phase 7 - Payment Orchestration
- Razorpay/Stripe/UPI/Cash adapters, payment intent lifecycle, capture/refund/idempotency.

## Phase 8 - GST and Invoicing
- GST computations, invoice generation, B2B/B2C handling, export-ready reporting.

## Phase 9 - Inventory and Procurement
- Stock ledgers, consumption from recipes, purchase orders, vendor management, low-stock alerts.

## Phase 10 - CRM and Customer Profiles
- Customer 360 profile, segmentation, order history insights, lifecycle tags.

## Phase 11 - Loyalty and Rewards
- Points engine, tier rules, earn/redeem policies, reward catalog and expiry policies.

## Phase 12 - Notifications and Campaigns
- Omnichannel notifications (email/sms/push/whatsapp), campaigns, templates, delivery analytics.

## Phase 13 - WhatsApp Ordering
- Catalog browsing, cart and reorder via WhatsApp, bot/webhook flows, handoff to staff.

## Phase 14 - AI Voice Ordering
- Voice assistant integration, intent extraction, order confirmation, human fallback.

## Phase 15 - Kiosk Ordering
- Self-service kiosk UX, branch provisioning, tokenized staff unlock, receipt generation.

## Phase 16 - Analytics and BI
- Sales dashboards, branch benchmarking, menu performance, demand forecasting data pipelines.

## Phase 17 - Multi-Branch and White-Label
- Tenant isolation hardening, branding configs, deployment profiles, mobile app generation pipeline.

## Phase 18 - Enterprise Hardening and Launch Ops
- Full observability, chaos/failure drills, security audits, backup/restore, runbooks, go-live support.

## Immediate Next-Sprint Target
- Execute Phases 2-4 end-to-end with integration tests and role-scoped APIs.
