import express, { Response, Request } from "express";
import cors from "cors";
import router from "./app/Routes";
import httpStatus from "http-status-codes";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/Middlewares/globalErrorHandler";
import { notFound } from "./app/Middlewares/not_found";
import passport from "passport";
const app = express();
import "./config/passport";
import session from "express-session";
import { envVars } from "./config/env";

app.use(
  session({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: envVars.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/v1/", router);

app.get("/", async (req: Request, res: Response) => {
  res.status(httpStatus.OK).send({
    success: true,
    message: "Hello, Welcome to your server.",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
