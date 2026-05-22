import db from "../../../../db/index.js";
import { usersTable } from "../../../../db/user-schema.js";
import { eq } from "drizzle-orm";

export const getUserById = async (userId: string) => {
    const user = await db
        .select({
            id: usersTable.id,
            email: usersTable.email,
            firstName: usersTable.firstName,
            lastName: usersTable.lastName,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

    return user[0] || null;
};