import express, { Response, Request } from "express";

const app = express();

app.get("/", async (req: Request, res: Response) => {
  res.status(200).send({
    success: true,
    message: "Hello, Welcome to your server.",
  });
});

export default app;
