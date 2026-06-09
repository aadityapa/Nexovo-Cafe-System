import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { authGuard } from "../../../../middleware/auth.middleware";
import { requirePermissions } from "../../../../middleware/rbac.middleware";
import { validate } from "../../../../middleware/validate.middleware";
import { createCategorySchema, createMenuItemSchema } from "./menu.schemas";

export const menuRouter = Router();

menuRouter.use(authGuard);
menuRouter.use(requirePermissions(["menu:manage"]));

menuRouter.get("/categories", async (request, response, next) => {
  try {
    const restaurantId = String(request.query.restaurantId || "");
    const categories = await prisma.menuCategory.findMany({
      where: {
        restaurantId,
        isActive: true
      },
      orderBy: { sortOrder: "asc" }
    });
    response.json(categories);
  } catch (error) {
    next(error);
  }
});

menuRouter.post("/categories", validate(createCategorySchema), async (request, response, next) => {
  try {
    const category = await prisma.menuCategory.create({
      data: request.body
    });
    response.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

menuRouter.get("/items", async (request, response, next) => {
  try {
    const restaurantId = String(request.query.restaurantId || "");
    const items = await prisma.menuItem.findMany({
      where: {
        restaurantId,
        isActive: true
      },
      include: { category: true }
    });
    response.json(items);
  } catch (error) {
    next(error);
  }
});

menuRouter.post("/items", validate(createMenuItemSchema), async (request, response, next) => {
  try {
    const item = await prisma.menuItem.create({
      data: {
        restaurantId: request.body.restaurantId,
        categoryId: request.body.categoryId,
        sku: request.body.sku,
        name: request.body.name,
        description: request.body.description,
        basePrice: request.body.price,
        taxRate: request.body.taxRate,
        isVegetarian: request.body.isVeg
      }
    });
    response.status(201).json(item);
  } catch (error) {
    next(error);
  }
});
