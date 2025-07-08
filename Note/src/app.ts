import express from "express";
import cors from "cors";
import signRouter from "../routes/sign-in";
import notes from "../routes/notes";
import userRoute from "../routes/user";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/otp", signRouter);
app.use("/notes", notes);
app.use("/getUser", userRoute);

export default app;
