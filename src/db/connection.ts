import { drizzle } from 'drizzle-orm/node-sqlite';
import { DatabaseSync } from 'node:sqlite';

export const createDb = (fileName: string) =>
  drizzle({ client: new DatabaseSync(fileName) });

export type Db = ReturnType<typeof createDb>;
