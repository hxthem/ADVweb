exports.getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let dashboardData = {};

    if (user.role === "student") {
      // جلب الورشات المسجل فيها الطالب
      dashboardData = await User.findById(req.user.id).populate(
        "enrolledWorkshops",
      );
    } else if (user.role === "representative") {
      // جلب الورشات التي أنشأها الأستاذ فقط
      const myWorkshops = await Workshop.find({ creator: req.user.id });
      dashboardData = { user, myWorkshops };
    } else if (user.role === "admin") {
      // إحصائيات عامة للأدمن (Data Science style)
      const stats = {
        totalStudents: await User.countDocuments({ role: "student" }),
        pendingRepresentatives: await User.countDocuments({
          role: "representative",
          isApproved: false,
        }),
        activeWorkshops: await Workshop.countDocuments({ status: "published" }),
      };
      dashboardData = { user, stats };
    }

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
