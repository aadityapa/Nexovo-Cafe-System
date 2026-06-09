export enum RoleCode {
  SUPER_ADMIN = "SUPER_ADMIN",
  RESTAURANT_OWNER = "RESTAURANT_OWNER",
  BRANCH_MANAGER = "BRANCH_MANAGER",
  CASHIER = "CASHIER",
  CHEF = "CHEF",
  WAITER = "WAITER",
  INVENTORY_MANAGER = "INVENTORY_MANAGER",
  ACCOUNTANT = "ACCOUNTANT",
  CUSTOMER = "CUSTOMER"
}

export enum PermissionCode {
  AUTH_SELF_READ = "auth:self:read",
  USER_MANAGE = "user:manage",
  RESTAURANT_MANAGE = "restaurant:manage",
  MENU_MANAGE = "menu:manage",
  ORDER_MANAGE = "order:manage",
  PAYMENT_MANAGE = "payment:manage",
  INVENTORY_MANAGE = "inventory:manage",
  STAFF_MANAGE = "staff:manage",
  LOYALTY_MANAGE = "loyalty:manage",
  RESERVATION_MANAGE = "reservation:manage",
  NOTIFICATION_MANAGE = "notification:manage",
  REPORTS_READ = "reports:read"
}

export type AuthUser = {
  userId: string;
  restaurantId?: string;
  branchId?: string;
  roles: RoleCode[];
  permissions: PermissionCode[];
};
