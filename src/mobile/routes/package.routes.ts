import { Router } from "express";
import {
  createPackage,
  getPackageDetails,
  getMyPackages,
  editPackage,
  deletePackage,
} from "../controllers/package.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import MultiFileUploadMiddleware from "../middlewares/multi-file-upload.middleware";
const router = Router();

router.post(
  "/create",
  AuthMiddleware,
  MultiFileUploadMiddleware,
  createPackage
);
router.put("/edit", AuthMiddleware, MultiFileUploadMiddleware, editPackage);
router.delete("/delete", AuthMiddleware, deletePackage);

router.get("/details", AuthMiddleware, getPackageDetails);
router.get("/my-packages", AuthMiddleware, getMyPackages);
export default router;
