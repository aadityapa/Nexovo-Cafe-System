process.env.NODE_ENV = process.env.NODE_ENV ?? "test";
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/cafe_platform?schema=public";
process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ?? "test-access-secret-minimum-length-12345";
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? "test-refresh-secret-minimum-length-12345";
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN ?? "*";
process.env.JWT_ACCESS_TTL = process.env.JWT_ACCESS_TTL ?? "15m";
process.env.JWT_REFRESH_TTL = process.env.JWT_REFRESH_TTL ?? "30d";
process.env.BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS ?? "12";
process.env.SWAGGER_SERVER_URL =
  process.env.SWAGGER_SERVER_URL ?? "http://localhost:4000";
