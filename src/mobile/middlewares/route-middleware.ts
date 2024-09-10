import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();
const RouteTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["x-route-token"];
  if (token && token === process.env.ROUTE_TOKEN) {
    next();
  } else {
    res.status(401).json({
      status: 401,
      message: "Unauthorized: Invalid or missing route token",
    });
  }
};
export default RouteTokenMiddleware;
