import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../../db/models";

interface IUserRequest extends Request {
  user: any;
}

const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader === "undefined")
    return res.status(401).send({
      success: false,
      status: 401,
      message: "Access denied. No token provided",
      error: "AuthorizationError",
    });

  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    const decoded = jwt.verify(token + "", process.env.SECRET_KEY + "");
    (req as IUserRequest).user = decoded;

    next();
  } catch (ex) {
    res.status(400).send({
      success: false,
      status: 400,
      error: "AuthorizationError",
      message: "Invalid or expired token provided",
    });
  }
};

export const validateUser = async (id: number) => {
  const user = await db.users.findByPk(id);
  if (!user) {
    throw {
      status: 404,
      message: "You do not have permission to, please register",
      error: "UserNotFound",
    };
  }
  if (user.isBlocked) {
    throw {
      status: 403,
      message: "You are blocked from this app, contact support",
      error: "User is blocked",
    };
  }
  return user;
};

export default AuthMiddleware;
