import { Router } from "express";
import { apiV1Router } from "../api/v1";
import { authRouter } from "../modules/auth/auth.routes";

export const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/", apiV1Router);
