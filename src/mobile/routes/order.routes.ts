import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import {
  addReview,
  cancelOrder,
  createOrder,
  getMyOrders,
  getShipments,
  retryPayment,
  updateOrderStatus,
  getOrderDetails,
} from "../controllers/order.controller";
const router = Router();
router.post("/create", AuthMiddleware, createOrder);
router.post("/retry-payment", AuthMiddleware, retryPayment);
router.post("/add-review", AuthMiddleware, addReview);
router.put("/cancel-order", AuthMiddleware, cancelOrder);
router.put("/update-status", AuthMiddleware, updateOrderStatus);
// router.post("/postpone", AuthMiddleware, postponeRequest);
// router.put("/mark-delivered", AuthMiddleware, markDelivered);
// router.get("/home-orders", AuthMiddleware,homeOrders );
router.get("/my-orders", AuthMiddleware, getMyOrders);
router.get("/order-details", AuthMiddleware, getOrderDetails);
router.get("/my-shipments", AuthMiddleware, getShipments);
export default router;
