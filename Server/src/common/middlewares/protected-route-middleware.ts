import ApiError from "../utils/api-error.js";

const protectedRoute = (req: any, res: any, next: any) => {
    if (!req.user?.isAuth) {
        return next(ApiError.unauthorized());
    }
    next();
};

export default protectedRoute;