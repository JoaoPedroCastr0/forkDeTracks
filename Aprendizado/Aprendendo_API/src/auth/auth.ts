import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../database/prisma";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: "http://localhost:4000/api/auth",
  trustedOrigins: ["http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:8080"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});

console.log("ENV TEST:");
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("SECRET:", process.env.BETTER_AUTH_SECRET);