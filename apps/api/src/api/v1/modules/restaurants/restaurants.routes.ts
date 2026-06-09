import { Router } from "express";
import { prisma } from "../../../../lib/prisma";
import { authGuard } from "../../../../middleware/auth.middleware";
import { requirePermissions } from "../../../../middleware/rbac.middleware";
import { validate } from "../../../../middleware/validate.middleware";
import { createBranchSchema, createRestaurantSchema } from "./restaurants.schemas";

export const restaurantRouter = Router();

restaurantRouter.use(authGuard);

/**
 * @openapi
 * /api/v1/restaurants:
 *   get:
 *     summary: List active restaurants
 */
restaurantRouter.get("/", requirePermissions(["restaurant:manage"]), async (_request, response, next) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { isActive: true },
      include: { branches: true },
      take: 50
    });
    response.json(restaurants);
  } catch (error) {
    next(error);
  }
});

restaurantRouter.post("/", requirePermissions(["restaurant:manage"]), validate(createRestaurantSchema), async (request, response, next) => {
  try {
    const restaurant = await prisma.restaurant.create({
      data: {
        slug: request.body.slug,
        name: request.body.displayName,
        legalName: request.body.legalName,
        timezone: request.body.timezone,
        currency: request.body.currency
      }
    });
    response.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
});

restaurantRouter.post(
  "/:restaurantId/branches",
  requirePermissions(["restaurant:manage"]),
  validate(createBranchSchema),
  async (request, response, next) => {
    try {
      const branch = await prisma.branch.create({
        data: {
          ...request.body,
          restaurantId: request.params.restaurantId
        }
      });
      response.status(201).json(branch);
    } catch (error) {
      next(error);
    }
  }
);
