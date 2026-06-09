import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verifyAccessToken } from "../lib/jwt";

export function authGuard(request: Request, _response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createHttpError(401, "Missing bearer token"));
  }

  const token = authHeader.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    request.user = {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      permissions: payload.permissions
    };
    return next();
  } catch (error) {
    return next(createHttpError(401, "Invalid access token", { cause: error }));
  }
}
