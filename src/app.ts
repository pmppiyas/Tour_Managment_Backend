import express, { Response, Request } from "express";
import cors from "cors";
import router from "./app/Routes";
import { globalErrorHandler } from "./app/Middlewares/globalErrorHandler";
import httpStatus from "http-status-codes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/", router);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).send({
    success: true,
    message: "Hello, Welcome to your server.",
  });
});

app.use(globalErrorHandler);

export default app;
