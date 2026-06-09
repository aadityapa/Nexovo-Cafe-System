import jwt from "jsonwebtoken";
import type { PermissionCode, RoleCode } from "@cafe/contracts";
import { env } from "../config/env";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  restaurantId?: string;
  branchId?: string;
  roles: RoleCode[];
  permissions: PermissionCode[];
};

export type RefreshTokenPayload = {
  sub: string;
  tokenId: string;
};

export const signAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL as jwt.SignOptions["expiresIn"]
  });

export const signRefreshToken = (payload: RefreshTokenPayload): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_TTL as jwt.SignOptions["expiresIn"]
  });

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

export const verifyRefreshToken = (token: string): RefreshTokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
