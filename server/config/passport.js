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
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const emails = profile.emails || [];
        const email = emails.length > 0 ? emails[0].value : null;
        
        if(!email){
          console.log("No emails found with this github account");
        }

        let user = await User.findOne({ email });

        const userId = uuidv4();

        if (!user) {
          const newUser = new User({
            userId : userId,
            name: profile.displayName || "pradheep",
            email: email || "mantissa6789@gmail.com",
            password: null,
          });
          await newUser.save();
        }
        return done(null, user);
      } catch (error) {
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
