import bcrypt from "bcryptjs";
import { env } from "../config/env";

export const hashPassword = async (rawPassword: string): Promise<string> =>
  bcrypt.hash(rawPassword, env.BCRYPT_ROUNDS);

export const verifyPassword = async (
  rawPassword: string,
  hashedPassword: string
): Promise<boolean> => bcrypt.compare(rawPassword, hashedPassword);
