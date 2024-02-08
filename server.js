import express from "express";
import AppRoute from "./routes";
import dbClient from "./utils/db";
import redisClient from "./utils/redis";
import UserController from "./controllers/UserController";
class App {
  port = process.env.PORT || 5000;

  constructor() {
    this.app = express();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.app.use(
      "/",
      new AppRoute(
        new AppController(dbClient, redisClient),
        new UserController(dbClient, redisClient)
      )
    );
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
