import type { SocketServer } from "./socket";
import { KITCHEN_NAMESPACE, ORDER_NAMESPACE } from "./socket";

export function emitOrderStatusUpdated(
  io: SocketServer,
  branchId: string,
  payload: { orderId: string; status: string; updatedAt: string }
) {
  io.of(ORDER_NAMESPACE).to(`branch:${branchId}`).emit("order:status-updated", payload);
}

export function emitKitchenStatusUpdated(
  io: SocketServer,
  branchId: string,
  payload: { orderId: string; ticketId: string; status: string; updatedAt: string }
) {
  io.of(KITCHEN_NAMESPACE).to(`kitchen:${branchId}`).emit("kitchen:status-updated", payload);
}
