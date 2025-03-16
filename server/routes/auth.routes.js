import { Router } from "express";
import passport from "passport";

const router = Router();

// Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http:://localhost:5173" }),
  (req, res) => {
    res.json({ message: "Google login successful", user: req.user });
  }
);

// GitHub OAuth login
router.get("/github", passport.authenticate("github"));

// GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "http:://localhost:5173" }),
  (req, res) => {
    res.json({ message: "GitHub login successful", user: req.user });
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
