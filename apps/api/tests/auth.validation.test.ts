import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

describe("auth validation", () => {
  it("rejects invalid login payload", async () => {
    const app = createApp();
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "invalid-email",
      password: "123"
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(Array.isArray(response.body.errors)).toBe(true);
  });
});
