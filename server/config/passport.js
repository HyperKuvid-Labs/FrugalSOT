import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv"; // Load environment variables
import User from "../model/user.model.js"; // Ensure correct path
import { v4 as uuidv4 } from "uuid";

dotenv.config(); // Load .env variables

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"], // ✅ Correct Scopes
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        const userId = uuidv4();

        if (!user) {
          user = new User({
            userId: userId,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"], // Required for email access
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("GitHub profile received:", profile.id);
        console.log("Profile emails:", JSON.stringify(profile.emails));

        // Get primary email - GitHub provides emails differently than Google
        let email = null;

        // Try to get from emails array first
        if (profile.emails && profile.emails.length > 0) {
          // Find primary email if available
          const primaryEmail =
            profile.emails.find((e) => e.primary) || profile.emails[0];
          email = primaryEmail.value;
          console.log("Found email:", email);
        }

        // Fallback email if none is available
        if (!email) {
          email = `github-${profile.id}@example.com`;
          console.log("Using fallback email:", email);
        }

        // Find existing user
        let user = await User.findOne({
          $or: [
            { email: email },
            { userId: profile.id.toString(), authProvider: "github" },
          ],
        });

        // Create new user if not found
        if (!user) {
          console.log("Creating new user with email:", email);
          user = new User({
            userId: profile.id.toString(),
            authProvider: "github",
            name: profile.displayName || profile.username || "GitHub User",
            email: email,
            // No password needed for OAuth
          });

          await user.save();
          console.log("New user created successfully");
        }

        return done(null, user);
      } catch (error) {
        console.error("GitHub auth error:", error.message);
        console.error(error.stack);
        return done(error, null);
      }
    }
  )
);

// ✅ Serialize & Deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
