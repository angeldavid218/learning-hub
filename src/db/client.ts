import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  return url;
};

const globalForDb = globalThis as typeof globalThis & {
  postgresClient?: ReturnType<typeof postgres>;
};

const getPostgresClient = () => {
  if (!globalForDb.postgresClient) {
    globalForDb.postgresClient = postgres(getDatabaseUrl(), {
      // Required when using Supabase transaction pooler (port 6543).
      prepare: false,
    });
  }

  return globalForDb.postgresClient;
};

export const db = drizzle({ client: getPostgresClient() });

export const closeDb = async () => {
  if (globalForDb.postgresClient) {
    await globalForDb.postgresClient.end();
    globalForDb.postgresClient = undefined;
  }
};
