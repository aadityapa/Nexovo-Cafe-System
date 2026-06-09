import type { NextFunction, Request, Response } from "express";
import type { LoginInput, LogoutInput, RefreshInput, RegisterInput } from "./auth.schemas";
import { ApiError } from "../../common/api-error";
import { authService } from "./auth.service";

export const authController = {
  register: async (
    req: Request<unknown, unknown, RegisterInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await authService.register(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  },

  login: async (
    req: Request<unknown, unknown, LoginInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await authService.login(req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  refresh: async (
    req: Request<unknown, unknown, RefreshInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await authService.refresh(req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  logout: async (
    req: Request<unknown, unknown, LogoutInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await authService.logout(req.body);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  },

  me: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth?.userId) {
        throw new ApiError(401, "Unauthorized");
      }
      const response = await authService.me(req.auth.userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
};
