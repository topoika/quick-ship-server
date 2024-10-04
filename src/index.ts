import express, { Application, Request, Response } from "express";
import http, { createServer } from "http";
import { ApolloServer } from "@apollo/server";
import * as admin from "firebase-admin";
import path from "path";
import fs from "fs";

import cors, { CorsRequest } from "cors";
// import * as serviceAccount from "../service-account.json";
import * as dotenv from "dotenv";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { expressMiddleware } from "@apollo/server/express4";

// Middelwares
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ErrorInterceptor } from "./middlewares/error-interceptor.middleware";
import { authChecker } from "./middlewares/auth-checker.middleware";
import Logger from "./logger";
import { authContext } from "./utils/authContext";
import { setupEventExpireBackgroundRunner } from "./utils/backgroundRunner";
import resolvers from "./modules/resolvers";
import bootstrapMobileApis from "./mobile";
import db from "./db/models";

const PORT: any = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.set("view engine", "ejs");
const httpServer = createServer(app);

const statusController = async (req: Request, res: Response) => {
  try {
    const users = await db.users.findAll();
    let results = {
      users,
      status: 200,
      success: true,
      message: "🚀 Server is running OK!!",
    };
    res.status(200).send(results);
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      status: 500,
      success: false,
      message: `Error occured: ${error.message}`,
    });
  }
};

// app.get("/privacy-and-policy", (req, res) => {
//   res.render(path.join(__dirname, "templates", "privacy-and-policy"));
// });
// app.get("/terms-and-conditions", (req, res) => {
//   res.render(path.join(__dirname, "templates", "terms-and-conditions"));
// });
app.get("/", (req, res) => {
  res.render(path.join(__dirname, "templates", "coming-soon"));
});

app.get("/status", statusController);

async function startServer(app: Application, httpServer: http.Server) {
  dotenv.config();
  const schema = await buildSchema({
    resolvers,
    validate: { forbidUnknownValues: false },
    globalMiddlewares: [ErrorInterceptor],
    authChecker,
  });

  const server = new ApolloServer({
    schema: schema,
    introspection: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(
    "/graphql",
    cors<CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: authContext,
    })
  );

  httpServer.listen(PORT, () => {
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    // });
    Logger.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer(app, httpServer).then(() => {
  bootstrapMobileApis(app);
  // setupEventExpireBackgroundRunner();
});
