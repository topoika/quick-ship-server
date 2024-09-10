import { Router } from "express";

import { registerValidator } from "../validators/auth.validator";

import ValidatorMiddleware from "../middlewares/validator.middleware";
import AuthMiddleware from "../middlewares/auth.middleware";
import { registerUser } from "../controllers/auth.controllers";

const router = Router();

router.post(
  "/register",
  ValidatorMiddleware(registerValidator, "body"),
  registerUser
);
// router.post("/login", ValidatorMiddleware(loginValidator, "body"), loginUser);
// router.post("/firebase-login", loginWithFirebase);
// router.post("/request-otp", requestPasswordResetOtp);
// router.post("/reset-password", resetPassword);
// router.post("/send-email-otp", AuthMiddleware, sendEmailOtp);
// router.post("/verify-email", AuthMiddleware, verifyEmail);

export default router;
