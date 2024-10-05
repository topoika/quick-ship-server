import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import {
  deleteRequest,
  createRequest,
  acceptRequest,
  rejectRequest,
  getMyRequests,
  getRequestDetails,
} from "../controllers/request.controller";
const router = Router();

router.post("/create", AuthMiddleware, createRequest);
router.put("/accept", AuthMiddleware, acceptRequest);
router.put("/reject", AuthMiddleware, rejectRequest);
router.delete("/delete", AuthMiddleware, deleteRequest);
router.get("/package-requests", AuthMiddleware, getMyRequests);
router.get("/details", AuthMiddleware, getRequestDetails);
export default router;
