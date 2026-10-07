import { drizzle } from 'drizzle-orm/node-sqlite';
import { DatabaseSync } from 'node:sqlite';

const sqlite = new DatabaseSync(process.env.DB_FILE_NAME ?? 'database');

export const db = drizzle({ client: sqlite });

export type Db = typeof db;
