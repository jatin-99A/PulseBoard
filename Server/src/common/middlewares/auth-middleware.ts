import { Request, Response, NextFunction } from "express";
import env from "../../config/env.js";
import { setValue } from "../../services/redis/redis.js";
import TokenService from "../utils/token.js";
import JWT from "jsonwebtoken";


const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token =
        req.cookies?.accessToken ||
        req.headers.authorization?.split(" ")[1];

    // 1. Access token valid
    if (token) {
        const decoded = TokenService.verifyPayloadToken(token);

        if (decoded) {
            req.user = {
                isAuth: true,
                userId: decoded.id,
            };

            return next();
        }
    }

    // 2. Try refresh token
    const refreshToken =
        req.cookies?.refreshToken ||
        req.headers["x-refresh-token"];

    if (!refreshToken) {
        req.user = {
            isAuth: false,
            userId: null,
        };

        return next();
    }

    const userId = await TokenService.verifyRefreshToken(refreshToken);

    if (!userId) {
        req.user = {
            isAuth: false,
            userId: null,
        };

        return next();
    }

    // 3. Generate new access token
    const accessToken = TokenService.generatePayloadToken(
        {
            id: userId,
        },
        (env.JWT_EXPIRES_IN as JWT.SignOptions["expiresIn"]) || "15m"
    );

    // 4. Generate new refresh token
    const refreshTokenObj = await TokenService.generateRefreshToken();

    if (!accessToken || !refreshTokenObj) {
        req.user = {
            isAuth: false,
            userId: null,
        };

        return next();
    }

    // 5. Save refresh token in redis
    await setValue(
        `refresh:${refreshTokenObj.hashedToken}`,
        userId,
        Number(env.REFRESH_EXPIRES_DAYS) * 24 * 60 * 60
    );

    // 6. Set cookies
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshTokenObj.token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge:
            Number(env.REFRESH_EXPIRES_DAYS) * 24 * 60 * 60 * 1000,
    });

    req.user = {
        isAuth: true,
        userId,
    };

    return next();
};

export default authMiddleware;