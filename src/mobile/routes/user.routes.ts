import { Router } from "express";
import {
  getUserInfo,
  updateProfile,
  deleteAccount,
} from "../controllers/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import ProfileFilesUploadMiddleware from "../middlewares/upload.profile.docs";

const router = Router();

router.get("/info", AuthMiddleware, getUserInfo);
router.put(
  "/update-profile",
  AuthMiddleware,
  ProfileFilesUploadMiddleware,
  updateProfile
);
router.delete("/delete-account", AuthMiddleware, deleteAccount);
export default router;
