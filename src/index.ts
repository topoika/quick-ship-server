import express, { Application, Request, Response } from "express";
import http, { createServer } from "http";
import { ApolloServer } from "@apollo/server";
import * as admin from "firebase-admin";

import cors, { CorsRequest } from "cors";
import * as serviceAccount from "../service-account.json";
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

const PORT: any = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.set("view engine", "ejs");
const httpServer = createServer(app);

const statusController = (req: Request, res: Response) => {
  res.status(200).send({ message: "🚀 Server is running OK!!" });
};

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
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    Logger.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer(app, httpServer).then(() => {
  //   bootstrapMobileApis(app);
  setupEventExpireBackgroundRunner();
});
