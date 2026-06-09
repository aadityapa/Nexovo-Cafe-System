import { OrderStatus, OrderType, PrismaClient, RoleCode } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "Demo@123";

const permissions = [
  { code: "auth:self:read", name: "Read Self" },
  { code: "restaurant:manage", name: "Manage Restaurant" },
  { code: "menu:manage", name: "Manage Menu" },
  { code: "menu:read", name: "Read Menu" },
  { code: "order:manage", name: "Manage Orders" },
  { code: "order:create", name: "Create Orders" },
  { code: "inventory:manage", name: "Manage Inventory" },
  { code: "reports:read", name: "Read Reports" }
];

const rolePermissionMap: Record<RoleCode, string[]> = {
  SUPER_ADMIN: permissions.map((p) => p.code),
  RESTAURANT_OWNER: permissions.map((p) => p.code),
  BRANCH_MANAGER: ["auth:self:read", "menu:manage", "menu:read", "order:manage", "inventory:manage", "reports:read"],
  CASHIER: ["auth:self:read", "order:manage", "menu:read"],
  CHEF: ["auth:self:read", "order:manage"],
  WAITER: ["auth:self:read", "order:manage", "menu:read"],
  INVENTORY_MANAGER: ["auth:self:read", "inventory:manage"],
  ACCOUNTANT: ["auth:self:read", "reports:read"],
  CUSTOMER: ["auth:self:read", "order:create", "menu:read"]
};

async function upsertRole(code: RoleCode, permissionCodes: string[]) {
  const role = await prisma.role.upsert({
    where: { code },
    update: { name: code.replace(/_/g, " ") },
    create: { code, name: code.replace(/_/g, " "), isSystemDefault: true }
  });
  const rows = await prisma.permission.findMany({ where: { code: { in: permissionCodes } } });
  for (const permission of rows) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
      update: {},
      create: { roleId: role.id, permissionId: permission.id }
    });
  }
  return role;
}

async function createUserWithRole(params: {
  email: string;
  firstName: string;
  lastName?: string;
  role: RoleCode;
  restaurantId?: string;
  branchId?: string;
}) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const user = await prisma.user.upsert({
    where: { email: params.email },
    update: {
      firstName: params.firstName,
      lastName: params.lastName,
      restaurantId: params.restaurantId,
      branchId: params.branchId
    },
    create: {
      email: params.email,
      passwordHash,
      firstName: params.firstName,
      lastName: params.lastName,
      restaurantId: params.restaurantId,
      branchId: params.branchId
    }
  });
  const role = await prisma.role.findUniqueOrThrow({ where: { code: params.role } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: { restaurantId: params.restaurantId, branchId: params.branchId },
    create: {
      userId: user.id,
      roleId: role.id,
      restaurantId: params.restaurantId,
      branchId: params.branchId
    }
  });
  return user;
}

async function main() {
  await prisma.restaurant.updateMany({
    where: { slug: { not: "nexovo-cafe" } },
    data: { isActive: false }
  });

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: { name: permission.name },
      create: { ...permission, description: permission.name }
    });
  }

  for (const roleCode of Object.keys(rolePermissionMap) as RoleCode[]) {
    await upsertRole(roleCode, rolePermissionMap[roleCode]);
  }

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: "nexovo-cafe" },
    update: { name: "Nexovo Cafe System", currency: "INR" },
    create: {
      name: "Nexovo Cafe System",
      legalName: "Nexovo Hospitality Pvt Ltd",
      slug: "nexovo-cafe",
      timezone: "Asia/Kolkata",
      currency: "INR"
    }
  });

  const branch = await prisma.branch.upsert({
    where: { restaurantId_code: { restaurantId: restaurant.id, code: "IND-01" } },
    update: {},
    create: {
      restaurantId: restaurant.id,
      name: "Indiranagar Flagship",
      code: "IND-01",
      addressLine1: "12th Main, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      postalCode: "560038",
      phone: "+91 80 4567 8900",
      email: "indiranagar@nexovo.demo"
    }
  });

  await createUserWithRole({
    email: "owner@nexovo.demo",
    firstName: "Aarav",
    lastName: "Mehta",
    role: RoleCode.RESTAURANT_OWNER,
    restaurantId: restaurant.id,
    branchId: branch.id
  });
  await createUserWithRole({
    email: "chef@nexovo.demo",
    firstName: "Priya",
    lastName: "Nair",
    role: RoleCode.CHEF,
    restaurantId: restaurant.id,
    branchId: branch.id
  });
  await createUserWithRole({
    email: "customer@brewbite.demo",
    firstName: "Rohan",
    lastName: "Kapoor",
    role: RoleCode.CUSTOMER
  });

  const customer = await prisma.customer.upsert({
    where: { restaurantId_email: { restaurantId: restaurant.id, email: "customer@nexovo.demo" } },
    update: {},
    create: {
      restaurantId: restaurant.id,
      email: "customer@nexovo.demo",
      phone: "+919876543210",
      firstName: "Rohan",
      lastName: "Kapoor"
    }
  });

  await prisma.loyaltyAccount.upsert({
    where: { customerId: customer.id },
    update: { pointsBalance: 420, tier: "GOLD" },
    create: { customerId: customer.id, pointsBalance: 420, tier: "GOLD" }
  });

  const categoryDefs = [
    { name: "Signature Coffee", sortOrder: 1 },
    { name: "Gourmet Burgers", sortOrder: 2 },
    { name: "Fresh Bowls", sortOrder: 3 },
    { name: "Desserts", sortOrder: 4 },
    { name: "Beverages", sortOrder: 5 }
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryDefs) {
    const row = await prisma.menuCategory.upsert({
      where: { restaurantId_name: { restaurantId: restaurant.id, name: cat.name } },
      update: { sortOrder: cat.sortOrder },
      create: { restaurantId: restaurant.id, name: cat.name, sortOrder: cat.sortOrder }
    });
    categories[cat.name] = row.id;
  }

  const menuItems = [
    { sku: "CF-001", name: "Caramel Latte", category: "Signature Coffee", price: 249, veg: true, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80", desc: "Rich espresso with velvety caramel and steamed milk." },
    { sku: "CF-002", name: "Cold Brew Tonic", category: "Signature Coffee", price: 279, veg: true, image: "https://images.unsplash.com/photo-1514434753799-6b6428f3bec6?w=600&q=80", desc: "Slow-steeped cold brew with citrus tonic sparkle." },
    { sku: "CF-003", name: "Hazelnut Cappuccino", category: "Signature Coffee", price: 229, veg: true, image: "https://images.unsplash.com/photo-1572442388796-11668a67e4d6?w=600&q=80", desc: "Classic cappuccino infused with roasted hazelnut." },
    { sku: "BG-001", name: "Truffle Mushroom Burger", category: "Gourmet Burgers", price: 399, veg: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", desc: "Grilled patty, truffle aioli, caramelized onions." },
    { sku: "BG-002", name: "Smoky BBQ Chicken Burger", category: "Gourmet Burgers", price: 449, veg: false, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80", desc: "Char-grilled chicken, cheddar, house BBQ glaze." },
    { sku: "BW-001", name: "Mediterranean Quinoa Bowl", category: "Fresh Bowls", price: 359, veg: true, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", desc: "Quinoa, feta, olives, roasted veggies, lemon herb." },
    { sku: "DS-001", name: "Belgian Chocolate Lava", category: "Desserts", price: 299, veg: true, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476b?w=600&q=80", desc: "Warm fondant with molten dark chocolate center." },
    { sku: "DS-002", name: "New York Cheesecake", category: "Desserts", price: 269, veg: true, image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600&q=80", desc: "Creamy classic slice with berry compote." },
    { sku: "BV-001", name: "Mango Passion Cooler", category: "Beverages", price: 199, veg: true, image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80", desc: "Tropical mango and passion fruit refresher." },
    { sku: "BV-002", name: "Iced Matcha Latte", category: "Beverages", price: 219, veg: true, image: "https://images.unsplash.com/photo-1515823064-d6ff0daf34a1?w=600&q=80", desc: "Ceremonial grade matcha over chilled milk." }
  ];

  const itemIds: string[] = [];
  for (const item of menuItems) {
    const row = await prisma.menuItem.upsert({
      where: { restaurantId_sku: { restaurantId: restaurant.id, sku: item.sku } },
      update: {
        name: item.name,
        description: item.desc,
        basePrice: item.price,
        imageUrl: item.image,
        isVegetarian: item.veg,
        isActive: true
      },
      create: {
        restaurantId: restaurant.id,
        categoryId: categories[item.category],
        sku: item.sku,
        name: item.name,
        description: item.desc,
        basePrice: item.price,
        imageUrl: item.image,
        taxRate: 5,
        isVegetarian: item.veg,
        prepTimeMinutes: 12
      }
    });
    itemIds.push(row.id);
  }

  for (let i = 1; i <= 8; i++) {
    await prisma.table.upsert({
      where: { branchId_tableCode: { branchId: branch.id, tableCode: `T${i}` } },
      update: {},
      create: {
        restaurantId: restaurant.id,
        branchId: branch.id,
        tableCode: `T${i}`,
        seatingCapacity: i <= 4 ? 2 : 4
      }
    });
  }

  const inventorySkus = [
    { sku: "INV-COFFEE", name: "Arabica Beans", unit: "kg", qty: 24 },
    { sku: "INV-MILK", name: "Fresh Milk", unit: "L", qty: 80 },
    { sku: "INV-BUN", name: "Brioche Buns", unit: "pcs", qty: 120 }
  ];

  for (const inv of inventorySkus) {
    const item = await prisma.inventoryItem.upsert({
      where: { restaurantId_sku: { restaurantId: restaurant.id, sku: inv.sku } },
      update: {},
      create: { restaurantId: restaurant.id, sku: inv.sku, name: inv.name, unit: inv.unit, reorderLevel: 10 }
    });
    await prisma.stockLevel.upsert({
      where: { branchId_inventoryItemId: { branchId: branch.id, inventoryItemId: item.id } },
      update: { availableQty: inv.qty },
      create: { branchId: branch.id, inventoryItemId: item.id, availableQty: inv.qty }
    });
  }

  await prisma.order.deleteMany({ where: { branchId: branch.id } });

  const orderDefs: { status: OrderStatus; type: OrderType; items: number[] }[] = [
    { status: OrderStatus.PREPARING, type: OrderType.DINE_IN, items: [0, 3] },
    { status: OrderStatus.READY, type: OrderType.TAKEAWAY, items: [1, 7] },
    { status: OrderStatus.PENDING, type: OrderType.DELIVERY, items: [4, 8] },
    { status: OrderStatus.COMPLETED, type: OrderType.DINE_IN, items: [2, 5, 6] }
  ];

  let orderIndex = 1;
  for (const def of orderDefs) {
    const selected = def.items.map((idx) => menuItems[idx]);
    const subtotal = selected.reduce((sum, item) => sum + item.price, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    const orderNumber = `NX-${1000 + orderIndex}`;

    await prisma.order.create({
      data: {
        restaurantId: restaurant.id,
        branchId: branch.id,
        customerId: customer.id,
        orderNumber,
        orderType: def.type,
        status: def.status,
        subtotalAmount: subtotal,
        taxAmount: tax,
        totalAmount: total,
        orderItems: {
          create: selected.map((item, idx) => ({
            menuItemId: itemIds[def.items[idx]],
            itemName: item.name,
            itemSku: item.sku,
            quantity: 1,
            unitPrice: item.price,
            lineTotal: item.price
          }))
        }
      }
    });
    orderIndex += 1;
  }

  // eslint-disable-next-line no-console
  console.log("Demo seed complete");
  // eslint-disable-next-line no-console
  console.log("Restaurant:", restaurant.name, "| Branch:", branch.name);
  // eslint-disable-next-line no-console
  console.log("Admin login: owner@nexovo.demo /", DEMO_PASSWORD);
  // eslint-disable-next-line no-console
  console.log("Customer login: customer@nexovo.demo /", DEMO_PASSWORD);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
