import { Router } from "express";
import { getUserInfo } from "../controllers/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/info", AuthMiddleware, getUserInfo);
export default router;
