import bcrypt from "bcryptjs";
import { env } from "../config/env";

export function hashPassword(plainText: string) {
  return bcrypt.hash(plainText, env.BCRYPT_ROUNDS);
}

export function comparePassword(plainText: string, passwordHash: string) {
  return bcrypt.compare(plainText, passwordHash);
}
