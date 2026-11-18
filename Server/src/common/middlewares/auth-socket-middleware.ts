import env from "../../config/env.js";
import { setValue } from "../../services/redis/redis.js";
import TokenService from "../utils/token.js";
import JWT from "jsonwebtoken";

// Helper to parse cookies from handshake headers
const parseCookies = (cookieHeader?: string): Record<string, string> => {
    if (!cookieHeader) return {};
    const cookies: Record<string, string> = {};
    cookieHeader.split(";").forEach((cookie) => {
        const [name, ...rest] = cookie.trim().split("=");
        if (name) {
            cookies[name] = decodeURIComponent(rest.join("="));
        }
    });
    return cookies;
};

const authSocketMiddleware = async (socket: any, next: (err?: any) => void) => {
    try {
        const cookies = parseCookies(socket.handshake?.headers?.cookie);

        const token =
            socket.handshake?.auth?.token ||
            socket.handshake?.auth?.accessToken ||
            cookies.accessToken ||
            socket.handshake?.headers?.authorization?.split(" ")[1];

        // 1. Access token valid
        if (token) {
            const decoded = TokenService.verifyPayloadToken(token);

            if (decoded) {
                socket.user = {
                    isAuth: true,
                    userId: decoded.id,
                };
                if (socket.data) {
                    socket.data.user = socket.user;
                }

                return next();
            }
        }

        // 2. Try refresh token
        const refreshToken =
            socket.handshake?.auth?.refreshToken ||
            cookies.refreshToken ||
            socket.handshake?.headers?.["x-refresh-token"];

        if (!refreshToken) {
            socket.user = {
                isAuth: false,
                userId: null,
            };
            if (socket.data) {
                socket.data.user = socket.user;
            }

            return next();
        }

        const userId = await TokenService.verifyRefreshToken(refreshToken as string);

        if (!userId) {
            socket.user = {
                isAuth: false,
                userId: null,
            };
            if (socket.data) {
                socket.data.user = socket.user;
            }

            return next();
        }

        await TokenService.revokeRefreshToken(refreshToken as string);

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
            socket.user = {
                isAuth: false,
                userId: null,
            };
            if (socket.data) {
                socket.data.user = socket.user;
            }

            return next();
        }

        // 5. Save refresh token in Redis
        await setValue(
            `refresh:${refreshTokenObj.hashedToken}`,
            userId,
            Number(env.REFRESH_EXPIRES_DAYS) * 24 * 60 * 60
        );

        // 6. Attach user to socket
        socket.user = {
            isAuth: true,
            userId,
        };
        if (socket.data) {
            socket.data.user = socket.user;
        }


        return next();
    } catch (error) {
        console.error("Socket authentication failed:", error);
        return next(new Error("Authentication failed"));
    }
};

export default authSocketMiddleware;
