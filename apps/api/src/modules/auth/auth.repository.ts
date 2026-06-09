import type { PermissionCode, RoleCode } from "@cafe/contracts";
import { Prisma, RoleCode as PrismaRoleCode } from "@prisma/client";
import { prisma } from "../../config/prisma";

type UserWithAccess = Prisma.UserGetPayload<{
  include: {
    userRoles: {
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
  };
}>;

const mapIdentity = (user: UserWithAccess) => {
  const roles = user.userRoles.map((ur) => ur.role.code as unknown as RoleCode);
  const permissionSet = new Set<PermissionCode>();
  user.userRoles.forEach((ur) => {
    ur.role.rolePermissions.forEach((rp) => {
      permissionSet.add(rp.permission.code as PermissionCode);
    });
  });

  return {
    userId: user.id,
    email: user.email,
    restaurantId: user.restaurantId ?? undefined,
    branchId: user.branchId ?? undefined,
    roles,
    permissions: [...permissionSet]
  };
};

const getUserWithAccess = (where: Prisma.UserWhereUniqueInput) =>
  prisma.user.findUnique({
    where,
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  });

export const authRepository = {
  createUser: (input: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName?: string;
    phone?: string;
  }) =>
    prisma.user.create({
      data: {
        ...input
      }
    }),

  assignRole: async (userId: string, roleCode: PrismaRoleCode) => {
    const role = await prisma.role.findUniqueOrThrow({
      where: { code: roleCode }
    });

    return prisma.userRole.create({
      data: {
        userId,
        roleId: role.id
      }
    });
  },

  getUserByEmail: (email: string) => getUserWithAccess({ email }),

  getUserIdentity: async (userId: string) => {
    const user = await getUserWithAccess({ id: userId });
    return user ? mapIdentity(user) : null;
  },

  updateLastLogin: (userId: string) =>
    prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    }),

  storeRefreshToken: (userId: string, tokenHash: string, expiresAt: Date) =>
    prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt
      }
    }),

  revokeRefreshToken: (tokenHash: string) =>
    prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    }),

  getRefreshToken: (tokenHash: string) =>
    prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    }),

  revokeAllUserTokens: (userId: string) =>
    prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    }),

  ensureRolesAndPermissions: async (
    roleCodes: PrismaRoleCode[],
    permissionCodes: string[],
    rolePermissionMap: Record<PrismaRoleCode, string[]>
  ) => {
    await prisma.$transaction(async (tx) => {
      for (const roleCode of roleCodes) {
        await tx.role.upsert({
          where: { code: roleCode },
          update: {},
          create: {
            code: roleCode,
            name: roleCode
          }
        });
      }

      for (const permissionCode of permissionCodes) {
        await tx.permission.upsert({
          where: { code: permissionCode },
          update: {},
          create: {
            code: permissionCode,
            name: permissionCode
          }
        });
      }

      for (const roleCode of roleCodes) {
        const list = rolePermissionMap[roleCode] ?? [];
        const role = await tx.role.findUniqueOrThrow({ where: { code: roleCode } });

        for (const permissionCode of list) {
          const permission = await tx.permission.findUniqueOrThrow({
            where: { code: permissionCode }
          });

          await tx.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: permission.id
              }
            },
            update: {},
            create: {
              roleId: role.id,
              permissionId: permission.id
            }
          });
        }
      }
    });
  }
};
