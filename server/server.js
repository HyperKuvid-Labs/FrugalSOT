import express from "express";
import dotenv from "dotenv";
import loadEnvConfigOfMongodb from "./config/dotenv.config.js";
import userRoutes from "./routes/user.routes.js";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();

const app = express();

loadEnvConfigOfMongodb();
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", // Only allow your frontend origin
    credentials: true, // Allow cookies if needed
  })
);

app.use(express.json());

app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
