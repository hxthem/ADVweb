const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true, // Required to access req.query.state
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Extract role from state query param (passed from authRoutes)
          const requestedRole = req.query.state || "student";

          user = await User.create({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value,
            provider: "google",
            password: Math.random().toString(36).slice(-8),
            role: "student", // ✅ Always student until approved
            repStatus: requestedRole === "representative" ? "pending" : "none",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "photos"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let email = profile.emails
          ? profile.emails[0].value
          : `${profile.id}@facebook.com`;
        let user = await User.findOne({ email: email });

        if (!user) {
          const requestedRole = req.query.state || "student";

          user = await User.create({
            fullName: `${profile.name.givenName} ${profile.name.familyName}`,
            email: email,
            avatar: profile.photos[0]?.value,
            provider: "facebook",
            password: Math.random().toString(36).slice(-8),
            role: "student", // ✅ Always student until approved
            repStatus: requestedRole === "representative" ? "pending" : "none",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // في MongoDB نستخدم findById
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
