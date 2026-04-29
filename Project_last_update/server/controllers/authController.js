const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ============================
// ✅ SIGNUP
// ============================
exports.signup = async (req, res) => {
  try {
    const { fullName, email, password, role, department, aiFocus, bio } =
      req.body;

    // Check if exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        ok: false,
        error: "Email already exists",
      });
    }

    // Create user
    const user = new User({
      fullName,
      email,
      password,
      role,

      department: role === "representative" ? department : undefined,
      aiFocus: role === "representative" ? aiFocus : undefined,
      bio: role === "representative" ? bio : undefined,

      isApproved: role === "representative" ? false : true,
    });

    await user.save();

    res.status(201).json({
      ok: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};
