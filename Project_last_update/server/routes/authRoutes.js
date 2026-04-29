const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// ─────────────────────────────────────────────
// Helper: Generate JWT
// ─────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ─────────────────────────────────────────────
// Helper: Build safe user object (no password)
// ─────────────────────────────────────────────
const buildUserPayload = (user) => ({
  id: user._id,
  fullName: user.fullName,
  role: user.role,
  email: user.email,
  repStatus: user.repStatus,
  enrolledWorkshopIds: user.enrolledWorkshopIds,
  avatar: user.avatar,
  department: user.department,
  aiFocus: user.aiFocus,
  bio: user.bio,
});

// ==========================================
// 1. POST /api/auth/signup — Register a new user
// ==========================================
// ✅ FIX: Was missing entirely. Frontend AuthProvider calls this.
router.post("/signup", async (req, res) => {
  const { fullName, email, password, department, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({
      fullName,
      email,
      password, // pre("save") hook hashes this automatically
      department: department || "",
      role: "student", // ✅ Always register as student initially
      repStatus: role === "representative" ? "pending" : "none",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: buildUserPayload(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 2. POST /api/auth/login — Local Login
// ==========================================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({
        token,
        user: buildUserPayload(user),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 3. GET /api/auth/me — Get current user
// ==========================================
router.get("/me", protect, async (req, res) => {
  try {
    // If user is a rep but not approved, we still let them see /me but with restricted payload
    const payload = buildUserPayload(req.user);
    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 4. Google OAuth
// ==========================================
router.get("/google", (req, res, next) => {
  const { role } = req.query;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: role || "student", // Pass role to callback via state
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
  }
);

// ==========================================
// 5. Facebook OAuth
// ==========================================
router.get("/facebook", (req, res, next) => {
  const { role } = req.query;
  passport.authenticate("facebook", {
    scope: ["email"],
    state: role || "student",
  })(req, res, next);
});

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=facebook_failed`,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
  }
);

module.exports = router;
