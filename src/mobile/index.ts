import express, { Express } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
import RouteTokenMiddleware from "./middlewares/route-middleware";

// routes import
import authRoutes from "./routes/auth.routes";

const bootstrapMobileApis = (app: Express) => {
  dotenv.config();
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  // Route to serve the image view
  app.get("/uploads/:dir/:name", (req, res) => {
    const { name, dir } = req.params;
    const imagePath = path.join(__dirname, `../../../uploads/${dir}`, name);
    if (fs.existsSync(imagePath)) {
      fs.createReadStream(imagePath).pipe(res);
    } else {
      res.status(404).send({
        status: 404,
        message: "Image not found",
      });
    }
  });

  // API routes
  app.use("/api/auth", authRoutes);

  app.use(RouteTokenMiddleware);
};

export default bootstrapMobileApis;
