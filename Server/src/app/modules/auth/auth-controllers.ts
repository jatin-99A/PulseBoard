import type { Request, Response } from 'express'
import { SignupDtoType } from './dto/signup-dto.js';
import ApiResponse from '../../../common/utils/api-response.js';
import { SigninDtoType } from './dto/signin-dto.js';
import ApiError from '../../../common/utils/api-error.js';
import signupService from './services/signup-service.js';
import signinService from './services/signin-service.js';
import signoutService from './services/signout-service.js';
import { getUserById } from './services/get-user-service.js';


class AuthenticationController {
    public async handleSignup(req: Request<{}, {}, SignupDtoType>, res: Response) {

        const result = await signupService(req.body);
        return ApiResponse.created(res, "User registered successfully", result);
    }

    public async handleSignin(
        req: Request<{}, {}, SigninDtoType>,
        res: Response
    ) {
        const {
            accessToken,
            refreshToken,
            user,
            cookieOptions,
            maxAgeofRefreshToken,
        } = await signinService(req.body);

        res.cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: maxAgeofRefreshToken,
        });

        return ApiResponse.ok(res, "Login successful", {
            user,
        });

    }

    public async getMe(req: Request, res: Response) {
        const userId = req.user?.userId;

        if (!userId) {
            throw ApiError.unauthorized();
        }

        const user = await getUserById(userId);

        if (!user) {
            throw ApiError.notFound("User not found");
        }

        return ApiResponse.ok(res, "User fetched successfully", user);
    }

    public async handleSignout(req: Request, res: Response) {
        const refreshToken =
            req.cookies?.refreshToken || req.headers["x-refresh-token"] as string | undefined;

        const { cookieOptions, maxAgeofRefreshToken } = await signoutService({
            refreshToken,
        });

        res.cookie("accessToken", "", {
            ...cookieOptions,
            maxAge: 0,
        });

        res.cookie("refreshToken", "", {
            ...cookieOptions,
            maxAge: maxAgeofRefreshToken,
        });

        return ApiResponse.ok(res, "Logout successful");
    }

}

export default AuthenticationController;