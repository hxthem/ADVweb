const express = require("express");
const router = express.Router();
const Workshop = require("../models/Workshop");
const User = require("../models/User");

router.get("/landing-data", async (req, res) => {
  try {
    // 1. جلب الإحصائيات (Stats Section)
    const stats = {
      workshopsCount: await Workshop.countDocuments(),
      departmentsCount: 12, // يمكن جعلها ديناميكية لاحقاً
      representativesCount: await User.countDocuments({
        role: "representative",
      }),
    };

    // 2. جلب آخر 3 ورشات عمل قادمة (Upcoming Workshops)
    const upcomingWorkshops = await Workshop.find({
      status: "published",
      date: { $gte: new Date() }, // تاريخ اليوم أو أحدث
    })
      .sort({ date: 1 }) // الأقرب تاريخاً أولاً
      .limit(3)
      .populate("creator", "fullName");

    res.json({ stats, upcomingWorkshops });
  } catch (error) {
    res.status(500).json({ message: "Error fetching landing data" });
  }
});

module.exports = router;
