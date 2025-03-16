import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import passport from "./config/passport.js"; // Import passport AFTER dotenv
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";

dotenv.config(); // Load .env variables
connectDB();

const app = express();

app.use(express.json());

// addinf cors lets see
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true, // This allows cookies to be sent cross-origin
  })
);

// ✅ Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Initialize Passport (Must be after session middleware)
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api", userRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
