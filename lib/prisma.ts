/**
 * This is the solution to issues with Prisma and Next.js in developemnt
 * where the connections to the Prisma client get exhaused due to hot reload
 *
 * https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV === "development") globalForPrisma.prisma = prisma;

export default prisma;
