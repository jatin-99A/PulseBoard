import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import JWT from 'jsonwebtoken';
import env from "../../../../config/env.js";
import db from "../../../../db/index.js";
import { usersTable } from "../../../../db/user-schema.js";
import ApiError from "../../../../common/utils/api-error.js";
import TokenService from "../../../../common/utils/token.js";
import { setValue } from "../../../../services/redis/redis.js";


const signinService = async (data: {
    email: string;
    password: string;
}) => {
    const { email, password } = data;

    // 1. find user
    const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

    if (!user.length) {
        throw ApiError.unauthorized("Invalid credentials");
    }

    const existingUser = user[0];

    // 2. check if email is verified
    if (!existingUser.emailVerified) {
        // throw ApiError.forbidden("Please verify your email before signing in");
    }

    // 3. check password if it matches
    const isMatch = await bcrypt.compare(
        password,
        existingUser.password!
    );

    if (!isMatch) {
        throw ApiError.unauthorized("Invalid credentials");
    }

    // 4. generate access token
    const accessToken = TokenService.generatePayloadToken({
        id: existingUser.id,
    }, env.JWT_EXPIRES_IN as JWT.SignOptions['expiresIn'] || '15m');

    if (!accessToken) {
        throw ApiError.internalError();
    }

    // 5. generate refresh token
    const token = await TokenService.generateRefreshToken();

    if (!token) {
        throw ApiError.internalError();
    }

    await setValue(`refresh:${token.hashedToken}`, existingUser.id, Number(env.REFRESH_EXPIRES_DAYS) * 24 * 60 * 60);

    return {
        accessToken,
        refreshToken: token.token,
        user: {
            id: existingUser.id,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
        },
        cookieOptions: {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax" as const,
        },
        maxAgeofRefreshToken: Number(env.REFRESH_EXPIRES_DAYS) * 24 * 60 * 60 * 1000,
    };
};

export default signinService;