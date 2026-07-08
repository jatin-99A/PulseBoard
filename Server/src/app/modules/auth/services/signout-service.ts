import env from "../../../../config/env.js";
import TokenService from "../../../../common/utils/token.js";

const signoutService = async (data: {
    refreshToken?: string;
}) => {
    const { refreshToken } = data;

    if (refreshToken) {
        await TokenService.revokeRefreshToken(refreshToken);
    }

    return {
        cookieOptions: {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax" as const,
        },
        maxAgeofRefreshToken: 0,
    };
};

export default signoutService;
