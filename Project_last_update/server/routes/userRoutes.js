const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// ==========================================
// 1. المسارات العامة (Public Routes)
// ==========================================

// جلب قائمة الممثلين المعتمدين للجمهور
router.get("/representatives", async (req, res) => {
  try {
    const reps = await User.find({
      role: "representative",
      repStatus: "approved",
    }).select("-password");

    res.json(reps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching representatives" });
  }
});

/**
 * @route   PATCH /api/users/complete-profile
 * @desc    إكمال بيانات المستخدم بعد التسجيل الاجتماعي
 * @access  Private
 */
router.patch("/complete-profile", protect, async (req, res) => {
  try {
    const { role, department, fullName } = req.body;
    
    const updateData = {
      fullName,
      department,
      isProfileComplete: true
    };

    if (role === "representative") {
      updateData.role = "student"; // Default role until approved
      updateData.repStatus = "pending";
    } else {
      updateData.role = "student";
      updateData.repStatus = "none";
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error completing profile" });
  }
});

// ==========================================
// 2. مسارات الإدارة (Admin Routes)
// ==========================================

/**
 * @route   GET /api/users
 * @desc    جلب جميع المستخدمين (للأدمن فقط)
 * @access  Private (Admin)
 */
router.get("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

/**
 * @route   PATCH /api/users/:id/approve
 * @desc    قبول طلب ممثل (للأدمن فقط)
 * @access  Private (Admin)
 */
router.patch("/:id/approve", protect, restrictTo("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { repStatus: "approved", role: "representative" },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error approving user" });
  }
});

/**
 * @route   PATCH /api/users/:id/reject
 * @desc    رفض طلب ممثل (للأدمن فقط)
 * @access  Private (Admin)
 */
router.patch("/:id/reject", protect, restrictTo("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { repStatus: "rejected" },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error rejecting user" });
  }
});

module.exports = router;
