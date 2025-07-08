import app from "./app";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "../db/mongo-connection";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
