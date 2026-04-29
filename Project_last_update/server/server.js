require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const path = require("path");

// ─── Import Passport strategies config ───────────────────────────────────────
require("./config/passport");

// ─── Import Routes ─────────────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const partnerRoutes = require("./routes/partnerRoutes");
const workshopRoutes = require("./routes/workshopRoutes");
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");

const app = express();

// ─── Core Middlewares ────────────────────────────────────────────────────────
// ✅ FIX: cors() and express.json() must come BEFORE route registration.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ FIX: passport.initialize() is required even for session: false strategies.
app.use(passport.initialize());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/users", userRoutes);
app.use("/api/home", homeRoutes);

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ Database connection error:", err));

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
