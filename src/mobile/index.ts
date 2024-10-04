import express, { Express } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
import RouteTokenMiddleware from "./middlewares/route-middleware";

// routes import
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import tripRoutes from "./routes/trip.routes";
import packageRoutes from "./routes/package.routes";

const bootstrapMobileApis = (app: Express) => {
  dotenv.config();
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  // Route to serve the image view
  app.get("/uploads/:dir/:name", (req, res) => {
    const { name, dir } = req.params;
    const imagePath = path.join(__dirname, `../../uploads/${dir}`, name);
    if (fs.existsSync(imagePath)) {
      fs.createReadStream(imagePath).pipe(res);
    } else {
      res.status(404).send({
        status: 404,
        message: "Image not found",
      });
    }
  });
  app.use(RouteTokenMiddleware);

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/trips", tripRoutes);
  app.use("/api/packages", packageRoutes);

  app.all("*", (req, res, next) => {
    res.status(404).send({
      status: 404,
      message: `Can't find ${req.originalUrl} on the server`,
    });
  });
};

export default bootstrapMobileApis;
