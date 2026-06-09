"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = require("../src/app");
(0, vitest_1.describe)("auth validation", () => {
    (0, vitest_1.it)("rejects invalid login payload", async () => {
        const app = (0, app_1.createApp)();
        const response = await (0, supertest_1.default)(app).post("/api/v1/auth/login").send({
            email: "invalid-email",
            password: "123"
        });
        (0, vitest_1.expect)(response.status).toBe(400);
        (0, vitest_1.expect)(response.body.message).toBe("Validation failed");
        (0, vitest_1.expect)(Array.isArray(response.body.errors)).toBe(true);
    });
});
