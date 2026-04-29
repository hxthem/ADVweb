const mongoose = require("mongoose");
const Workshop = require("../models/Workshop");
const User = require("../models/User");

/**
 * @desc    جلب الورشات / الفعاليات مع فلاتر البحث والنوع
 * @access  Public
 */
exports.getWorkshops = async (req, res) => {
  try {
    const { search, status, department, topic, audience, category, participant, creator } = req.query;

    let query = {};

    // 1. تحديد حالة النشر (Status)
    if (status === "draft" || status === "published") {
      query.status = status;
    } else {
      query.status = "published";
    }

    // 2. البحث النصي
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 3. الفلاتر الأساسية
    if (department && department !== "all") query.department = department;
    if (topic && topic !== "all") query.topic = topic;
    if (audience && audience !== "all") query.audience = audience;
    if (category && category !== "all") query.category = category;

    // 4. تصفية حسب المشارك (Joined Sessions)
    if (participant) {
      if (mongoose.Types.ObjectId.isValid(participant)) {
        // البحث داخل مصفوفة المشاركين
        query.participants = new mongoose.Types.ObjectId(participant);
      } else {
        return res.status(200).json([]);
      }
    }

    // 5. تصفية حسب المنشئ (Creator)
    if (creator) {
      if (mongoose.Types.ObjectId.isValid(creator)) {
        query.creator = new mongoose.Types.ObjectId(creator);
      }
    }

    // جلب البيانات
    let workshops = await Workshop.find(query)
      .populate("creator", "fullName avatar")
      .sort({ date: 1 })
      .lean();

    // 6. تصفية زمنية
    const now = new Date();
    if (status === "upcoming") {
      workshops = workshops.filter((w) => new Date(w.date) >= now);
    } else if (status === "past") {
      workshops = workshops.filter((w) => new Date(w.date) < now);
    }

    res.status(200).json(workshops);
  } catch (error) {
    console.error("Backend Error [getWorkshops]:", error);
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

/**
 * @desc    جلب تفاصيل فعالية واحدة
 */
exports.getWorkshopById = async (req, res) => {
  try {
    const workshopId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(workshopId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const workshop = await Workshop.findById(workshopId)
      .populate("creator", "fullName email avatar")
      .lean();

    if (!workshop) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(workshop);
  } catch (error) {
    console.error("Backend Error [getWorkshopById]:", error);
    res.status(500).json({ message: "Error fetching details", error: error.message });
  }
};

/**
 * @desc    إنشاء فعالية جديدة
 */
exports.createWorkshop = async (req, res) => {
  try {
    let workshopData = { ...req.body };
    const path = require("path");

    if (req.files) {
      if (req.files.coverImage) {
        workshopData.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
      }
      if (req.files.resources) {
        workshopData.resources = req.files.resources.map((file) => {
          const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
          let type = "pdf";
          if (["ppt", "pptx"].includes(ext)) type = "slides";
          if (["zip", "rar"].includes(ext)) type = "code";
          return {
            title: file.originalname,
            type,
            url: `/uploads/${file.filename}`,
            size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
          };
        });
      }
    }

    const workshop = await Workshop.create({
      ...workshopData,
      creator: req.user._id,
    });

    res.status(201).json(workshop);
  } catch (error) {
    console.error("Backend Error [createWorkshop]:", error);
    res.status(500).json({ message: "Error creating event", error: error.message });
  }
};

/**
 * @desc    تسجيل/إلغاء تسجيل (Toggle Enrollment)
 */
exports.toggleEnrollment = async (req, res) => {
  try {
    const workshopId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(workshopId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) return res.status(404).json({ message: "Event not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // تصفية المصفوفة للمقارنة الآمنة
    const currentParticipants = workshop.participants || [];
    const isEnrolled = currentParticipants.some(id => id.toString() === userId.toString());

    if (isEnrolled) {
      // ❌ Unregister
      workshop.participants = currentParticipants.filter(id => id.toString() !== userId.toString());
      workshop.enrolledCount = Math.max(0, (workshop.enrolledCount || 1) - 1);
      
      user.enrolledWorkshopIds = (user.enrolledWorkshopIds || []).filter(id => id.toString() !== workshopId.toString());
    } else {
      // ✅ Register
      const max = workshop.maxParticipants || 50;
      if (workshop.enrolledCount >= max) {
        return res.status(400).json({ message: "Event is full" });
      }

      if (!workshop.participants) workshop.participants = [];
      workshop.participants.push(userId);
      workshop.enrolledCount = (workshop.enrolledCount || 0) + 1;

      if (!user.enrolledWorkshopIds) user.enrolledWorkshopIds = [];
      user.enrolledWorkshopIds.push(workshopId);
    }

    // تنفيذ التحديثات في قاعدة البيانات
    await Workshop.updateOne(
      { _id: workshopId },
      { 
        $set: { 
          participants: workshop.participants,
          enrolledCount: workshop.enrolledCount
        }
      }
    );

    await User.updateOne(
      { _id: userId },
      { 
        $set: { enrolledWorkshopIds: user.enrolledWorkshopIds }
      }
    );

    // جلب بيانات المستخدم المحدثة لإرجاعها للفرونت آند
    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json({
      message: isEnrolled ? "Unregistered" : "Enrolled",
      isEnrolled: !isEnrolled,
      enrolledCount: workshop.enrolledCount,
      updatedUser: updatedUser
    });
  } catch (error) {
    console.error("Backend Error [toggleEnrollment]:", error);
    res.status(500).json({ message: "Enrollment action failed", error: error.message });
  }
};
