import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import signRouter from "../routes/sign-in";
import notes from "../routes/notes";
import userRoute from "../routes/user";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://note-app-alpha-six.vercel.app"],
    credentials: true, // if using cookies or Authorization headers
  })
);
app.get("/", (_req: Request, res: Response) => {
  res.send("Server is alive");
});
app.use("/otp", signRouter);
app.use("/notes", notes);
app.use("/getUser", userRoute);

export default app;
