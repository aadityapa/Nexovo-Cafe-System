import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { authGuard } from "../../../../middleware/auth.middleware";
import { requirePermissions } from "../../../../middleware/rbac.middleware";
import { validate } from "../../../../middleware/validate.middleware";
import { createInventoryItemSchema, recordMovementSchema } from "./inventory.schemas";

export const inventoryRouter = Router();

inventoryRouter.use(authGuard);
inventoryRouter.use(requirePermissions(["inventory:manage"]));

inventoryRouter.get("/items", async (request, response, next) => {
  try {
    const restaurantId = String(request.query.restaurantId || "");
    const items = await prisma.inventoryItem.findMany({
      where: {
        restaurantId,
        isActive: true
      },
      orderBy: { name: "asc" }
    });
    response.json(items);
  } catch (error) {
    next(error);
  }
});

inventoryRouter.post("/items", validate(createInventoryItemSchema), async (request, response, next) => {
  try {
    const item = await prisma.inventoryItem.create({
      data: request.body
    });
    response.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

inventoryRouter.post("/movements", validate(recordMovementSchema), async (request, response, next) => {
  try {
    const movement = await prisma.stockMovement.create({
      data: request.body
    });
    response.status(201).json(movement);
  } catch (error) {
    next(error);
  }
});
