import { Router } from "express";
import {
  createTrip,
  editTrip,
  deleteTrip,
  getMyTrips,
  getTripDetails,
  getRouteTrips,
} from "../controllers/trip.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.post("/create", AuthMiddleware, createTrip);
router.put("/edit", AuthMiddleware, editTrip);
router.delete("/delete", AuthMiddleware, deleteTrip);
router.get("/my-trips", AuthMiddleware, getMyTrips);
router.post("/route-trips", AuthMiddleware, getRouteTrips);
router.get("/details", AuthMiddleware, getTripDetails);
export default router;
