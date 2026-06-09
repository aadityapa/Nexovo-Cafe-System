import { randomUUID } from "crypto";
import { RoleCode as PrismaRoleCode, UserStatus } from "@prisma/client";
import type { LoginInput, LogoutInput, RefreshInput, RegisterInput } from "./auth.schemas";
import { ApiError } from "../../common/api-error";
import { defaultRolePermissions } from "../../common/permissions";
import { env } from "../../config/env";
import { authRepository } from "./auth.repository";
import { durationToMs } from "../../utils/duration";
import { sha256 } from "../../utils/hash";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../../utils/jwt";
import { hashPassword, verifyPassword } from "../../utils/password";

const roleCodes = Object.values(PrismaRoleCode);
const permissionCodes = [...new Set(Object.values(defaultRolePermissions).flat())];

const rolePermissionMap = roleCodes.reduce<Record<PrismaRoleCode, string[]>>(
  (acc, roleCode) => {
    acc[roleCode] = defaultRolePermissions[roleCode] ?? [];
    return acc;
  },
  {} as Record<PrismaRoleCode, string[]>
);

const ensureAccessDefaults = async (): Promise<void> => {
  await authRepository.ensureRolesAndPermissions(
    roleCodes,
    permissionCodes,
    rolePermissionMap
  );
};

const buildTokenPair = async (
  userId: string,
  email: string,
  restaurantId: string | null,
  branchId: string | null
) => {
  const identity = await authRepository.getUserIdentity(userId);
  if (!identity) {
    throw new ApiError(401, "Unable to resolve identity");
  }

  const tokenId = randomUUID();
  const refreshToken = signRefreshToken({ sub: userId, tokenId });
  const accessToken = signAccessToken({
    sub: userId,
    email,
    restaurantId: restaurantId ?? undefined,
    branchId: branchId ?? undefined,
    roles: identity.roles,
    permissions: identity.permissions
  });

  const refreshTokenHash = sha256(refreshToken);
  const expiresAt = new Date(Date.now() + durationToMs(env.JWT_REFRESH_TTL));
  await authRepository.storeRefreshToken(userId, refreshTokenHash, expiresAt);

  return { accessToken, refreshToken };
};

export const authService = {
  register: async (payload: RegisterInput) => {
    await ensureAccessDefaults();

    const existing = await authRepository.getUserByEmail(payload.email);
    if (existing) {
      throw new ApiError(409, "Email already registered");
    }

    const passwordHash = await hashPassword(payload.password);
    const createdUser = await authRepository.createUser({
      email: payload.email,
      passwordHash,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone
    });

    await authRepository.assignRole(createdUser.id, PrismaRoleCode.CUSTOMER);

    const tokens = await buildTokenPair(
      createdUser.id,
      createdUser.email,
      createdUser.restaurantId,
      createdUser.branchId
    );

    return {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName
      },
      ...tokens
    };
  },

  login: async (payload: LoginInput) => {
    await ensureAccessDefaults();

    const user = await authRepository.getUserByEmail(payload.email);
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ApiError(403, "User is inactive");
    }

    const isValid = await verifyPassword(payload.password, user.passwordHash);
    if (!isValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    await authRepository.updateLastLogin(user.id);

    const tokens = await buildTokenPair(
      user.id,
      user.email,
      user.restaurantId,
      user.branchId
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      ...tokens
    };
  },

  refresh: async (payload: RefreshInput) => {
    const refreshTokenHash = sha256(payload.refreshToken);
    const tokenRecord = await authRepository.getRefreshToken(refreshTokenHash);

    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      throw new ApiError(401, "Refresh token is invalid or expired");
    }

    let parsedToken;
    try {
      parsedToken = verifyRefreshToken(payload.refreshToken);
    } catch {
      throw new ApiError(401, "Refresh token signature invalid");
    }

    if (parsedToken.sub !== tokenRecord.userId) {
      throw new ApiError(401, "Refresh token subject mismatch");
    }

    await authRepository.revokeRefreshToken(refreshTokenHash);

    const tokens = await buildTokenPair(
      tokenRecord.user.id,
      tokenRecord.user.email,
      tokenRecord.user.restaurantId,
      tokenRecord.user.branchId
    );

    return tokens;
  },

  logout: async (payload: LogoutInput) => {
    const refreshTokenHash = sha256(payload.refreshToken);
    await authRepository.revokeRefreshToken(refreshTokenHash);
    return { success: true };
  },

  me: async (userId: string) => {
    const identity = await authRepository.getUserIdentity(userId);
    if (!identity) {
      throw new ApiError(404, "User not found");
    }

    return identity;
  }
};
