import cron from 'node-cron';
import db from '../db/index.js';
import { usersTable } from '../db/user-schema.js';
import { lt, and, eq } from 'drizzle-orm';

cron.schedule('0 * * * *', async () => {
  await db
    .delete(usersTable)
    .where(
      and(
        eq(usersTable.emailVerified, false),
        lt(usersTable.emailVerificationExpires, new Date())
      )
    );

  console.log('Cleanup done');
});
