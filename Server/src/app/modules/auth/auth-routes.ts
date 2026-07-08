import { Router } from "express";
import { catchAsync } from "../../../common/utils/catch-async-error.js";
import AuthenticationController from "./auth-controllers.js";
import validate from "../../../common/middlewares/validate-middleware.js";
import { SignupDto } from "./dto/signup-dto.js";
import { SigninDto } from "./dto/signin-dto.js";
import protectedRoute from "../../../common/middlewares/protected-route-middleware.js";

const router = Router();

const authenticationController = new AuthenticationController();

router.post(
    "/signup",
     validate(SignupDto), catchAsync(authenticationController.handleSignup.bind(authenticationController))
);

router.post(
    "/signin",
     validate(SigninDto), catchAsync(authenticationController.handleSignin.bind(authenticationController))
);

router.post(
    "/signout",
    catchAsync(authenticationController.handleSignout.bind(authenticationController))
);

router.post(
    "/me",
    protectedRoute,
    catchAsync(authenticationController.getMe.bind(authenticationController))
);


export default router;