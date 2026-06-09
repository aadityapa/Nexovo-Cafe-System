import { Router } from "express";
import { healthRouter } from "./modules/health/health.routes";
import { restaurantRouter } from "./modules/restaurants/restaurants.routes";
import { menuRouter } from "./modules/menu/menu.routes";
import { orderRouter } from "./modules/orders/orders.routes";
import { inventoryRouter } from "./modules/inventory/inventory.routes";
import { demoRouter } from "./modules/demo/demo.routes";

export const apiV1Router = Router();

apiV1Router.use("/health", healthRouter);
apiV1Router.use("/public", demoRouter);
apiV1Router.use("/restaurants", restaurantRouter);
apiV1Router.use("/menu", menuRouter);
apiV1Router.use("/orders", orderRouter);
apiV1Router.use("/inventory", inventoryRouter);
