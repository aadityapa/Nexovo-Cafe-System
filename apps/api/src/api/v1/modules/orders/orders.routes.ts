import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { authGuard } from "../../../../middleware/auth.middleware";
import { requirePermissions } from "../../../../middleware/rbac.middleware";
import { validate } from "../../../../middleware/validate.middleware";
import { emitOrderStatusUpdated } from "../../../../realtime/events";
import { createOrderSchema, updateOrderStatusSchema } from "./orders.schemas";

export const orderRouter = Router();

orderRouter.use(authGuard);
orderRouter.use(requirePermissions(["order:manage"]));

orderRouter.get("/", async (request, response, next) => {
  try {
    const branchId = String(request.query.branchId || "");
    const orders = await prisma.order.findMany({
      where: { branchId },
      include: { orderItems: true, payments: true },
      orderBy: { placedAt: "desc" },
      take: 50
    });

    response.json(orders);
  } catch (error) {
    next(error);
  }
});

orderRouter.post("/", validate(createOrderSchema), async (request, response, next) => {
  try {
    const subtotal = request.body.items.reduce((total: number, item: { quantity: number; unitPrice: number }) => {
      return total + item.quantity * item.unitPrice;
    }, 0);
    const tax = 0;
    const totalAmount = subtotal + tax;
    const orderNumber = `ORD-${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        restaurantId: request.body.restaurantId,
        branchId: request.body.branchId,
        customerId: request.body.customerId,
        orderNumber,
        orderType: request.body.orderType,
        status: "PENDING",
        subtotalAmount: subtotal,
        taxAmount: tax,
        totalAmount,
        notes: request.body.notes,
        orderItems: {
          create: request.body.items.map((item: { menuItemId?: string; itemName: string; itemSku?: string; quantity: number; unitPrice: number }) => ({
            menuItemId: item.menuItemId,
            itemName: item.itemName,
            itemSku: item.itemSku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.quantity * item.unitPrice
          }))
        }
      },
      include: { orderItems: true }
    });

    if (request.app.socketServer) {
      emitOrderStatusUpdated(request.app.socketServer, order.branchId, {
        orderId: order.id,
        status: order.status,
        updatedAt: order.updatedAt.toISOString()
      });
    }

    response.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

orderRouter.patch("/:orderId/status", validate(updateOrderStatusSchema), async (request, response, next) => {
  try {
    const order = await prisma.order.update({
      where: { id: request.params.orderId },
      data: { status: request.body.status }
    });

    if (request.app.socketServer) {
      emitOrderStatusUpdated(request.app.socketServer, order.branchId, {
        orderId: order.id,
        status: order.status,
        updatedAt: order.updatedAt.toISOString()
      });
    }

    response.json(order);
  } catch (error) {
    next(error);
  }
});
