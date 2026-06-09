import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../common/api-error";

export const notFoundMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new ApiError(404, "Route not found"));
};

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.issues,
      details: error.flatten()
    });
    return;
  }

  res.status(500).json({
    message: "Internal server error"
  });
};
