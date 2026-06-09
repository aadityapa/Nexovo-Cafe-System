"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const permissions = [
    { code: "auth:self:read", name: "Read Self", description: "Read own profile" },
    { code: "restaurant:manage", name: "Manage Restaurant", description: "Manage restaurants and branches" },
    { code: "menu:manage", name: "Manage Menu", description: "Manage categories and menu items" },
    { code: "order:manage", name: "Manage Orders", description: "Manage order lifecycle" },
    { code: "inventory:manage", name: "Manage Inventory", description: "Manage stock and movements" },
    { code: "reports:read", name: "Read Reports", description: "Read analytics and reports" }
];
const rolePermissionMap = {
    SUPER_ADMIN: permissions.map((permission) => permission.code),
    RESTAURANT_OWNER: ["auth:self:read", "restaurant:manage", "menu:manage", "order:manage", "inventory:manage", "reports:read"],
    BRANCH_MANAGER: ["auth:self:read", "menu:manage", "order:manage", "inventory:manage", "reports:read"],
    CASHIER: ["auth:self:read", "order:manage"],
    CHEF: ["auth:self:read", "order:manage"],
    WAITER: ["auth:self:read", "order:manage"],
    INVENTORY_MANAGER: ["auth:self:read", "inventory:manage"],
    ACCOUNTANT: ["auth:self:read", "reports:read"],
    CUSTOMER: ["auth:self:read", "order:manage"]
};
async function main() {
    for (const permission of permissions) {
        await prisma.permission.upsert({
            where: { code: permission.code },
            update: { description: permission.description },
            create: permission
        });
    }
    for (const roleCode of Object.keys(rolePermissionMap)) {
        const role = await prisma.role.upsert({
            where: { code: roleCode },
            update: {},
            create: { code: roleCode, name: roleCode }
        });
        const permissionRows = await prisma.permission.findMany({
            where: { code: { in: rolePermissionMap[roleCode] } }
        });
        for (const permission of permissionRows) {
            await prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
                update: {},
                create: { roleId: role.id, permissionId: permission.id }
            });
        }
    }
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
});
