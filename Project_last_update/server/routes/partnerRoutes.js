const express = require("express");
const router = express.Router();
const Partner = require("../models/Partner"); // تأكد من إنشاء الـ Model

// جلب جميع الشركاء من MongoDB Atlas
router.get("/", async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: "Error fetching partners" });
  }
});

// إضافة شريك جديد (يمكنك استخدامه من Postman حالياً)
router.post("/", async (req, res) => {
  const newPartner = new Partner(req.body);
  try {
    const saved = await newPartner.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
