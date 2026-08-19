import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// keepAlive + a modest idle timeout stop the pool from handing out connections
// that a serverless Postgres host (e.g. Neon) has silently dropped after
// inactivity — without this, a long-lived Node process starts throwing
// "Connection terminated unexpectedly" once traffic resumes after a lull.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 20_000,
  keepAlive: true,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
