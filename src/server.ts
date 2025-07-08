/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";
let server: Server;

const port = envVars.PORT;

const startServer = async () => {
  try {
    await mongoose
      .connect(`${envVars.DB_URL}`)
      .then(() => {
        console.log("Connected to Database");
      })
      .catch((error) => {
        console.log(error);
      });

    server = app.listen(port, () => {
      console.log(`Server is running in port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

process.on("unhandledRejection", (error) => {
  console.log("Unhandle Rejection Detected... Server sutting down", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log("Uncaught exception detected. Server sutting down", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("Sigterm signal recieved. Server sutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal recieved. Server sutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
