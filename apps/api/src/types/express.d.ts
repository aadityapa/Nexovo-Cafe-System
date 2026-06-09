import type { SocketServer } from "../realtime/socket";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        roles: string[];
        permissions: string[];
      };
    }

    interface Application {
      socketServer?: SocketServer;
    }
  }
}

export {};
import type { PermissionCode, RoleCode } from "@cafe/contracts";

type AuthContext = {
  userId: string;
  email: string;
  restaurantId?: string;
  branchId?: string;
  roles: RoleCode[];
  permissions: PermissionCode[];
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export {};
