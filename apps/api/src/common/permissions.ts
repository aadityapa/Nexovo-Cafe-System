import { PermissionCode } from "@cafe/contracts";

export const defaultRolePermissions: Record<string, PermissionCode[]> = {
  SUPER_ADMIN: [
    PermissionCode.AUTH_SELF_READ,
    PermissionCode.USER_MANAGE,
    PermissionCode.RESTAURANT_MANAGE,
    PermissionCode.MENU_MANAGE,
    PermissionCode.ORDER_MANAGE,
    PermissionCode.PAYMENT_MANAGE,
    PermissionCode.INVENTORY_MANAGE,
    PermissionCode.STAFF_MANAGE,
    PermissionCode.LOYALTY_MANAGE,
    PermissionCode.RESERVATION_MANAGE,
    PermissionCode.NOTIFICATION_MANAGE,
    PermissionCode.REPORTS_READ
  ],
  RESTAURANT_OWNER: [
    PermissionCode.AUTH_SELF_READ,
    PermissionCode.USER_MANAGE,
    PermissionCode.RESTAURANT_MANAGE,
    PermissionCode.MENU_MANAGE,
    PermissionCode.ORDER_MANAGE,
    PermissionCode.PAYMENT_MANAGE,
    PermissionCode.INVENTORY_MANAGE,
    PermissionCode.STAFF_MANAGE,
    PermissionCode.LOYALTY_MANAGE,
    PermissionCode.RESERVATION_MANAGE,
    PermissionCode.NOTIFICATION_MANAGE,
    PermissionCode.REPORTS_READ
  ],
  BRANCH_MANAGER: [
    PermissionCode.AUTH_SELF_READ,
    PermissionCode.MENU_MANAGE,
    PermissionCode.ORDER_MANAGE,
    PermissionCode.INVENTORY_MANAGE,
    PermissionCode.STAFF_MANAGE,
    PermissionCode.RESERVATION_MANAGE,
    PermissionCode.REPORTS_READ
  ],
  CASHIER: [
    PermissionCode.AUTH_SELF_READ,
    PermissionCode.ORDER_MANAGE,
    PermissionCode.PAYMENT_MANAGE
  ],
  CHEF: [PermissionCode.AUTH_SELF_READ, PermissionCode.ORDER_MANAGE],
  WAITER: [
    PermissionCode.AUTH_SELF_READ,
    PermissionCode.ORDER_MANAGE,
    PermissionCode.RESERVATION_MANAGE
  ],
  INVENTORY_MANAGER: [PermissionCode.AUTH_SELF_READ, PermissionCode.INVENTORY_MANAGE],
  ACCOUNTANT: [
    PermissionCode.AUTH_SELF_READ,
    PermissionCode.PAYMENT_MANAGE,
    PermissionCode.REPORTS_READ
  ],
  CUSTOMER: [PermissionCode.AUTH_SELF_READ]
};
