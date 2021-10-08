import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler
} from "./errorhandlers.js";
import usersRouter from "./services/users/index.js";
import reviewsRouter from "./services/reviews/index.js";

const server = express();
const port = process.env.PORT || 3001;

server.use(express.json());
server.use(cors());

server.use("/users", usersRouter);
server.use("/reviews", reviewsRouter);
server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("successful!! to Mongo");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`server running on port ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
