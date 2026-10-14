import { drizzle } from 'drizzle-orm/node-sqlite';
import { DatabaseSync } from 'node:sqlite';

export const createDb = (fileName: string) =>
  drizzle({ client: new DatabaseSync(fileName) });

export type Db = ReturnType<typeof createDb>;

export type DbTransaction = Parameters<Parameters<Db['transaction']>[0]>[0];

export type DbExecutor = Db | DbTransaction;
