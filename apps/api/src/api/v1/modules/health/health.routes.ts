import { Router } from "express";

export const healthRouter = Router();

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     summary: API health status
 *     responses:
 *       200:
 *         description: API is healthy
 */
healthRouter.get("/", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "cafe-api",
    timestamp: new Date().toISOString()
  });
});
