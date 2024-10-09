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
    res.status(422).json({
      status: 422,
      message: "Missing/Invalid route token headers",
    });
  }
};
export default RouteTokenMiddleware;
