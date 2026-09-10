import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../database/prisma';

const authSecret =
  process.env.BETTER_AUTH_SECRET || 'chave_secreta_padrao_longa_e_aleatoria_123456';
const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:4000';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

export const auth = betterAuth({
  secret: authSecret,
  baseURL: baseUrl,
  trustedOrigins: [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      papel: {
        type: 'string',
        defaultValue: 'ALUNO',
        required: false,
        input: false,
      },
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
