import { Router } from "express";
import {
  getFAQs,
  getFeeds,
  getHomeUserStats,
  getUserNotifications,
} from "../controllers/app.data.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
const router = Router();
router.get("/faqs", getFAQs);
router.get("/feeds", getFeeds);
router.get("/home-user-stats", AuthMiddleware, getHomeUserStats);
router.get("/user-notifications", AuthMiddleware, getUserNotifications);
export default router;
