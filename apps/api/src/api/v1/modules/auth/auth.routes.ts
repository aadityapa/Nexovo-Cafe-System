import { Router } from "express";
import { authGuard } from "../../../../middleware/auth.middleware";
import { validate } from "../../../../middleware/validate.middleware";
import { getMe, login, logout, refresh, register } from "./auth.service";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schemas";

export const authRouter = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 */
authRouter.post("/register", validate(registerSchema), async (request, response, next) => {
  try {
    const tokens = await register(request.body);
    response.status(201).json(tokens);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user credentials
 */
authRouter.post("/login", validate(loginSchema), async (request, response, next) => {
  try {
    const tokens = await login(request.body);
    response.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Exchange refresh token for new access token
 */
authRouter.post("/refresh", validate(refreshSchema), async (request, response, next) => {
  try {
    const tokens = await refresh(request.body.refreshToken);
    response.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", validate(refreshSchema), async (request, response, next) => {
  try {
    await logout(request.body.refreshToken);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     summary: Current authenticated user profile
 */
authRouter.get("/me", authGuard, async (request, response, next) => {
  try {
    const result = await getMe(request.user!.userId);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
