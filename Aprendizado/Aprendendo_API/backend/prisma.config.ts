import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const databaseUrl =
  process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/db';

if (!process.env.DATABASE_URL) {
  console.warn(
    'Warning: DATABASE_URL is not defined, using fallback for build-time operations.',
  );
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
