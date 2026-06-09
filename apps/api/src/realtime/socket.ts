import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env";

export const ORDER_NAMESPACE = "/orders";
export const KITCHEN_NAMESPACE = "/kitchen";

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true
    }
  });

  io.of(ORDER_NAMESPACE).on("connection", (socket) => {
    socket.on("order:subscribe", (branchId: string) => {
      socket.join(`branch:${branchId}`);
    });
  });

  io.of(KITCHEN_NAMESPACE).on("connection", (socket) => {
    socket.on("kitchen:subscribe", (branchId: string) => {
      socket.join(`kitchen:${branchId}`);
    });
  });

  return io;
}

export type SocketServer = ReturnType<typeof createSocketServer>;
