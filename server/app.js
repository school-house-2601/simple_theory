import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./db/db.js";
import lessonsRouter from "#api/routes/lessons";
import statsRouter from "#api/routes/stats";
import usersRouter from "#api/routes/users";
import xpRouter from "#api/routes/xp";
import progressRouter from "#api/routes/progress";
import getUserFromToken from "#middleware/getUserFromToken";
import { createToken } from "#utils/jwt";

const app = express();

// 1. MUST BE FIRST: Configure CORS with strict credential permissions
app.use(
  cors({
    origin: function (origin, callback) {
      const allowed = [process.env.CORS_ORIGIN, "http://localhost:5173"];
      if (
        !origin ||
        allowed.includes(origin) ||
        origin.endsWith("-sarah-hopp-s-projects.vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// 2. MUST BE SECOND: Configure your unified session store rules cleanly
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);

// 3. Initialize passport session tracking
app.use(passport.initialize());
app.use(passport.session());

// 4. Global parse structures
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Auth validation status endpoint for Vite fetch requests
app.get("/auth/user-status", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false, user: null });
  }
});

// 6. Passport Google Strategy configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userEmail = profile.emails[0].value;
        const firstName = profile.name.givenName || "Google User";
        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [userEmail],
        );
        if (result.rows.length > 0) {
          return done(null, result.rows[0]);
        } else {
          const newUser = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
            [firstName, userEmail, "OAUTH_GOOGLE_ACCOUNT"],
          );
          return done(null, newUser.rows[0]);
        }
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// 7. Core Authentication Redirect & Logout Paths
app.get(
  "/auth/google",
  (req, res, next) => {
    // Save where to redirect after login
    if (req.query.redirect) {
      req.session.redirectTo = req.query.redirect;
    }
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login`,
  }),
  async (req, res) => {
    const token = createToken({ id: req.user.id });
    const redirectTo = req.session.redirectTo || "/selection";
    delete req.session.redirectTo;
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}${redirectTo}?token=${token}`,
    );
  },
);

// ADDED LOGOUT HANDLER: Destroys the cookie and session context storage
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }

    req.session.destroy(() => {
      res.clearCookie("connect.sid", { path: "/" });
      res.json({ success: true, message: "Logged out completely!" });
    });
  });
});

// 8. Dynamic middleware wrapper to prevent manual JWT bypass breaks
app.use((req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  getUserFromToken(req, res, next);
});

// 9. Standard Feature API Routers
app.use("/lessons", lessonsRouter);
app.use("/stats", statsRouter);
app.use("/users", usersRouter);
app.use("/xp", xpRouter);
app.use("/progress", progressRouter);

// 10. Central Error handling structures
app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);
    case "23505":
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;
