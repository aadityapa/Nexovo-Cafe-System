import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export function requirePermissions(requiredPermissions: string[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) {
      return next(createHttpError(401, "Authentication required"));
    }

    const hasAllPermissions = requiredPermissions.every((permission) => request.user?.permissions.includes(permission));
    if (!hasAllPermissions) {
      return next(createHttpError(403, "Insufficient permissions"));
    }

    return next();
  };
}

export function requireRoles(requiredRoles: string[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) {
      return next(createHttpError(401, "Authentication required"));
    }

    const hasAnyRole = requiredRoles.some((role) => request.user?.roles.includes(role));
    if (!hasAnyRole) {
      return next(createHttpError(403, "Insufficient role access"));
    }

    return next();
  };
}
