import { drizzle } from 'drizzle-orm/neon-http';
import env from '../config/env';

const db = drizzle(env.DATABASE_URL);

export async function testDbConnection() {
  try {
    await db.execute('SELECT 1');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export default db;
