import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";
import { OOTP } from "../utils/otp-mapper";
import jwtKey from "../utils/jwtkey";
import jwt from "jsonwebtoken";
import { User } from "../model/user";

const signRouter = Router();

signRouter.post("/", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(404).json("Email is required");
    return;
  }
  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: `${process.env.EMAIL}`,
      pass: process.env.PASSWORD, // use app password if using Gmail
    },
  });

  // Mail options
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f3f3f3;
        padding: 20px;
      }
      .container {
        background-color: #ffffff;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        margin: auto;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .otp {
        font-size: 24px;
        font-weight: bold;
        color: #2e86de;
        letter-spacing: 4px;
        margin: 20px 0;
      }
      .footer {
        font-size: 12px;
        color: #888;
        text-align: center;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Email Verification</h2>
      <p>Use the OTP below to verify your email address:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
      <p>If you did not request this, you can ignore this email.</p>
      <div class="footer">© 2025 Your Company Name</div>
    </div>
  </body>
</html>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    OOTP.set(email, otp);
    setTimeout(() => {
      if (OOTP.has(email)) OOTP.delete(email);
    }, 1000 * 60 * 5);
    res.status(200).json("OTP sent");
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to send OTP");
  }
});

signRouter.post("/verifyOtp", async (req: Request, res: Response) => {
  let { email, otp, date, name } = req.body as {
    email?: string;
    otp?: string;
    date?: Date;
    name?: String;
  };
  const parsedDate = date ? new Date(date) : undefined;
  if (!email || !otp) {
    res.status(404).json({ error: "Fill all fields" });
    return;
  }
  if (OOTP.has(email)) {
    if (OOTP.get(email) === otp) {
      OOTP.delete(email);
      const token = jwt.sign(email, jwtKey);
      if (parsedDate && name) {
        try {
          let user = new User({ email, parsedDate, name: name });
          await user.save();
          res.status(200).json({ token: token, user: user });
        } catch (err) {
          res.status(400).json({
            error:
              err instanceof Error ? err.message : "An unknown error occurred",
          });
        }
      } else {
        try {
          let user = await User.findOne({ email });
          if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
          }

          res.status(200).json({ token: token, user: user });
        } catch (err) {
          res.status(500).json({
            error:
              err instanceof Error ? err.message : "An unknown error occurred",
          });
        }
      }
    } else {
      res.status(401).json({ error: "Invalid OTP" });
    }
  } else {
    res.status(410).json({ error: "OTP has expired" });
  }
});

export default signRouter;
