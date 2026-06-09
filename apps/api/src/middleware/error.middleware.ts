import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export function errorMiddleware(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (createHttpError.isHttpError(error)) {
    return response.status(error.statusCode).json({
      message: error.message
    });
  }

  if (error instanceof Error) {
    return response.status(500).json({
      message: error.message
    });
  }

  return response.status(500).json({
    message: "Unexpected error occurred"
  });
}
