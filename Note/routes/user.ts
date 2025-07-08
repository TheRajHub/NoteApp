import { Router, Request, Response } from "express";
import jwtKey from "../utils/jwtkey";
import jwt from "jsonwebtoken";
import { User } from "../model/user";

const userRoute = Router();

userRoute.get("/", async (req: Request, res: Response) => {
  let token = req.headers["authorization"]?.split(" ")[1];
  let payload = jwt.verify(token ?? "", jwtKey);
  try {
    let user = await User.findOne({ email: payload });
    if (!user) {
      res.status(401).json({ error: "UnAuthorized" });
      return;
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
});

export default userRoute;
