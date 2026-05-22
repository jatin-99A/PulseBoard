import bcrypt from "bcrypt";
import db  from "../../../../db/index.js";
import { usersTable } from "../../../../db/user-schema.js";

const signupService = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const result = await db
        .insert(usersTable)
        .values({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
        })
        .returning({
            id: usersTable.id,
            email: usersTable.email,
        });

    return result[0];
};

export default signupService