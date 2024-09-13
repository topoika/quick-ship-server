import { Router } from "express";

import {
  registerUser,
  loginUser,
  sendEmailOtp,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/send-email-otp", AuthMiddleware, sendEmailOtp);
router.post("/verify-email", AuthMiddleware, verifyEmail);
router.post("/login", loginUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
