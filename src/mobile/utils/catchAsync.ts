import { RequestHandler } from "express";

const catchAsync =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.log("SERVER ERROR", error);
      return res.status(500).json({
        status: 500,
        message: "An error occurred",
        error: error.message,
      });
    });
  };

export default catchAsync;
