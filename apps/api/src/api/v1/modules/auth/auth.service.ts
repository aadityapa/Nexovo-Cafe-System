import createHttpError from "http-errors";
import { prisma } from "../../../../lib/prisma";
import { comparePassword, hashPassword } from "../../../../lib/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../../../lib/jwt";
import { hashToken } from "../../../../lib/token-hash";

function computeExpiry(days: number) {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
}

async function createSessionTokens(userId: string, email: string) {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true }
  });

  const roleIds = userRoles.map((role) => role.roleId);
  const rolePermissions = await prisma.rolePermission.findMany({
    where: { roleId: { in: roleIds } },
    include: { permission: true }
  });

  const roles = userRoles.map((role) => role.role.code);
  const permissions = Array.from(new Set(rolePermissions.map((item) => item.permission.code)));

  const accessToken = signAccessToken({
    sub: userId,
    email,
    roles,
    permissions
  });
  const refreshToken = signRefreshToken({ sub: userId, email });

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: computeExpiry(30)
    }
  });

  return { accessToken, refreshToken, roles, permissions };
}

export async function register(payload: { email: string; firstName: string; lastName?: string; password: string; phone?: string }) {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) {
    throw createHttpError(409, "Email already registered");
  }

  const ownerRole = await prisma.role.findUnique({ where: { code: "RESTAURANT_OWNER" } });
  if (!ownerRole) {
    throw createHttpError(500, "Role seed missing: RESTAURANT_OWNER");
  }

  const user = await prisma.user.create({
    data: {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      passwordHash: await hashPassword(payload.password),
      userRoles: {
        create: {
          roleId: ownerRole.id
        }
      }
    }
  });

  return createSessionTokens(user.id, user.email);
}

export async function login(payload: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: {
      userRoles: {
        include: { role: true }
      }
    }
  });

  if (!user || !user.passwordHash) {
    throw createHttpError(401, "Invalid email or password");
  }

  const passwordMatched = await comparePassword(payload.password, user.passwordHash);
  if (!passwordMatched) {
    throw createHttpError(401, "Invalid email or password");
  }

  return createSessionTokens(user.id, user.email);
}

export async function refresh(refreshToken: string) {
  let payload: Pick<{ sub: string; email: string }, "sub" | "email">;

  try {
    payload = verifyRefreshToken(refreshToken) as Pick<{ sub: string; email: string }, "sub" | "email">;
  } catch {
    throw createHttpError(401, "Invalid refresh token");
  }

  const refreshTokenRow = await prisma.refreshToken.findUnique({
    where: {
      tokenHash: hashToken(refreshToken)
    }
  });

  if (!refreshTokenRow || refreshTokenRow.userId !== payload.sub || refreshTokenRow.revokedAt) {
    throw createHttpError(401, "Refresh token revoked");
  }

  return createSessionTokens(payload.sub, payload.email);
}

export async function logout(refreshToken: string) {
  await prisma.refreshToken.updateMany({
    where: {
      tokenHash: hashToken(refreshToken),
      revokedAt: null
    },
    data: {
      revokedAt: new Date()
    }
  });
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: { role: true }
      }
    }
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return {
    id: user.id,
    email: user.email,
    fullName: [user.firstName, user.lastName].filter(Boolean).join(" "),
    roles: user.userRoles.map((userRole) => userRole.role.code)
  };
}
