import express, { Response, Request } from "express";
import cors from "cors";
import router from "./app/Routes";

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

export default app;
