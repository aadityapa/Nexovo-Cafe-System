import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../common/api-error";
import { authRepository } from "../modules/auth/auth.repository";
import { verifyAccessToken } from "../utils/jwt";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing access token"));
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = verifyAccessToken(token);
    const identity = await authRepository.getUserIdentity(payload.sub);
    if (!identity) {
      return next(new ApiError(401, "User not found"));
    }

    req.auth = identity;
    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};
