const express = require("express");
const router = express.Router();
const {
  createWorkshop,
  getWorkshops,
  getWorkshopById,
  toggleEnrollment,
} = require("../controllers/workshopController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ==========================================
// 1. المسارات العامة (Public Routes)
// ==========================================

router.get("/", getWorkshops);
router.get("/:id", getWorkshopById);

// ==========================================
// 2. المسارات المحمية (Protected Routes)
// ==========================================

router.post("/:id/enroll", protect, toggleEnrollment);

// ==========================================
// 3. مسارات الإدارة والممثلين (Reps & Admins Only)
// ==========================================

router.post(
  "/",
  protect,
  restrictTo("representative", "admin"),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "resources", maxCount: 10 },
  ]),
  createWorkshop,
);

module.exports = router;
