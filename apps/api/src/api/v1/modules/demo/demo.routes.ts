import { Router } from "express";
import { OrderStatus, OrderType, PaymentMethod, PaymentStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { validate } from "../../../../middleware/validate.middleware";
import { authGuard } from "../../../../middleware/auth.middleware";
import { requirePermissions } from "../../../../middleware/rbac.middleware";

export const demoRouter = Router();

const createPublicOrderSchema = z.object({
  restaurantId: z.string().uuid(),
  branchId: z.string().uuid(),
  orderType: z.nativeEnum(OrderType).default(OrderType.DELIVERY),
  customerName: z.string().min(2).optional(),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().uuid(),
        itemName: z.string().min(1),
        itemSku: z.string().optional(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive()
      })
    )
    .min(1)
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus)
});

demoRouter.get("/bootstrap", async (_request, response, next) => {
  try {
    let restaurant = await prisma.restaurant.findFirst({
      where: { slug: "nexovo-cafe", isActive: true },
      include: {
        branches: { where: { isActive: true }, take: 1 },
        menuCategories: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: {
            menuItems: {
              where: { isActive: true },
              orderBy: { name: "asc" }
            }
          }
        }
      }
    });

    if (!restaurant) {
      restaurant = await prisma.restaurant.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: {
          branches: { where: { isActive: true }, take: 1 },
          menuCategories: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            include: {
              menuItems: {
                where: { isActive: true },
                orderBy: { name: "asc" }
              }
            }
          }
        }
      });
    }

    if (!restaurant) {
      response.status(404).json({ message: "Demo restaurant not found. Run npm run prisma:seed" });
      return;
    }

    const branch = restaurant.branches[0];
    const items = restaurant.menuCategories.flatMap((category) =>
      category.menuItems.map((item) => ({
        ...item,
        categoryId: category.id,
        categoryName: category.name,
        basePrice: Number(item.basePrice)
      }))
    );

    response.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        currency: restaurant.currency
      },
      branch: branch
        ? {
            id: branch.id,
            name: branch.name,
            code: branch.code,
            city: branch.city
          }
        : null,
      categories: restaurant.menuCategories.map((c) => ({
        id: c.id,
        name: c.name,
        sortOrder: c.sortOrder,
        itemCount: c.menuItems.length
      })),
      items,
      demoAccounts: {
        admin: { email: "owner@nexovo.demo", password: "Demo@123" },
        customer: { email: "customer@nexovo.demo", password: "Demo@123" }
      }
    });
  } catch (error) {
    next(error);
  }
});

demoRouter.post("/orders", validate(createPublicOrderSchema), async (request, response, next) => {
  try {
    const subtotal = request.body.items.reduce(
      (total: number, item: { quantity: number; unitPrice: number }) => total + item.quantity * item.unitPrice,
      0
    );
    const tax = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + tax;
    const orderNumber = `NX-${Date.now().toString().slice(-6)}`;

    const order = await prisma.order.create({
      data: {
        restaurantId: request.body.restaurantId,
        branchId: request.body.branchId,
        orderNumber,
        orderType: request.body.orderType,
        status: OrderStatus.PENDING,
        subtotalAmount: subtotal,
        taxAmount: tax,
        totalAmount,
        notes: request.body.notes,
        orderItems: {
          create: request.body.items.map(
            (item: {
              menuItemId: string;
              itemName: string;
              itemSku?: string;
              quantity: number;
              unitPrice: number;
            }) => ({
              menuItemId: item.menuItemId,
              itemName: item.itemName,
              itemSku: item.itemSku,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              lineTotal: item.quantity * item.unitPrice
            })
          )
        },
        payments: {
          create: {
            method: PaymentMethod.UPI,
            status: PaymentStatus.CAPTURED,
            amount: totalAmount,
            currency: "INR",
            settledAt: new Date()
          }
        }
      },
      include: { orderItems: true, payments: true }
    });

    response.status(201).json({
      ...order,
      subtotalAmount: Number(order.subtotalAmount),
      taxAmount: Number(order.taxAmount),
      totalAmount: Number(order.totalAmount)
    });
  } catch (error) {
    next(error);
  }
});

demoRouter.get("/orders/:orderId", async (request, response, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: request.params.orderId },
      include: { orderItems: true, payments: true }
    });
    if (!order) {
      response.status(404).json({ message: "Order not found" });
      return;
    }
    response.json({
      ...order,
      subtotalAmount: Number(order.subtotalAmount),
      taxAmount: Number(order.taxAmount),
      totalAmount: Number(order.totalAmount)
    });
  } catch (error) {
    next(error);
  }
});

demoRouter.get("/orders", async (request, response, next) => {
  try {
    const branchId = String(request.query.branchId || "");
    const orders = await prisma.order.findMany({
      where: branchId ? { branchId } : undefined,
      include: { orderItems: true, payments: true },
      orderBy: { placedAt: "desc" },
      take: 50
    });
    response.json(
      orders.map((order) => ({
        ...order,
        subtotalAmount: Number(order.subtotalAmount),
        taxAmount: Number(order.taxAmount),
        totalAmount: Number(order.totalAmount)
      }))
    );
  } catch (error) {
    next(error);
  }
});

demoRouter.patch(
  "/orders/:orderId/status",
  authGuard,
  requirePermissions(["order:manage"]),
  validate(updateStatusSchema),
  async (request, response, next) => {
    try {
      const order = await prisma.order.update({
        where: { id: request.params.orderId },
        data: { status: request.body.status }
      });
      response.json({
        ...order,
        subtotalAmount: Number(order.subtotalAmount),
        taxAmount: Number(order.taxAmount),
        totalAmount: Number(order.totalAmount)
      });
    } catch (error) {
      next(error);
    }
  }
);

demoRouter.get("/analytics", async (request, response, next) => {
  try {
    const branchId = String(request.query.branchId || "");
    const where = branchId ? { branchId } : {};

    const [orders, menuCount, lowStock] = await Promise.all([
      prisma.order.findMany({ where, include: { orderItems: true } }),
      prisma.menuItem.count({ where: { isActive: true } }),
      prisma.stockLevel.findMany({
        where: branchId ? { branchId } : undefined,
        include: { inventoryItem: true }
      })
    ]);

    const revenue = orders
      .filter((o) => o.status === OrderStatus.COMPLETED)
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const activeStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.ACCEPTED,
      OrderStatus.PREPARING,
      OrderStatus.READY
    ];
    const activeOrders = orders.filter((o) => activeStatuses.includes(o.status)).length;
    const avgTicket =
      orders.length > 0 ? orders.reduce((sum, o) => sum + Number(o.totalAmount), 0) / orders.length : 0;

    const topItems = orders
      .flatMap((o) => o.orderItems)
      .reduce<Record<string, { name: string; qty: number }>>((acc, item) => {
        acc[item.itemName] = acc[item.itemName]
          ? { name: item.itemName, qty: acc[item.itemName].qty + item.quantity }
          : { name: item.itemName, qty: item.quantity };
        return acc;
      }, {});

    const bestsellers = Object.values(topItems)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    response.json({
      revenueToday: revenue,
      ordersToday: orders.length,
      activeOrders,
      avgTicket: Math.round(avgTicket),
      menuItems: menuCount,
      lowStockCount: lowStock.filter((s) => Number(s.availableQty) < 15).length,
      bestsellers,
      ordersByStatus: Object.values(OrderStatus).map((status) => ({
        status,
        count: orders.filter((o) => o.status === status).length
      }))
    });
  } catch (error) {
    next(error);
  }
});
