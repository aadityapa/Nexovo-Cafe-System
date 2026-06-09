import type { NextFunction, Request, Response } from "express";
import type { PermissionCode } from "@cafe/contracts";
import { ApiError } from "../common/api-error";

export const requirePermissions =
  (...permissions: PermissionCode[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const userPermissions = new Set(req.auth.permissions);
    const missingPermission = permissions.find((p) => !userPermissions.has(p));

    if (missingPermission) {
      return next(new ApiError(403, `Forbidden: missing ${missingPermission}`));
    }

    return next();
  };
