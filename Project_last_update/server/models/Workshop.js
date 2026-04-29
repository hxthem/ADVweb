const mongoose = require("mongoose");

const WorkshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["workshop", "seminar", "competition", "technical", "research", "ethics", "industry"],
      default: "workshop",
    },

    department: {
      type: String,
      default: "Computer Science",
    },

    topic: {
      type: String,
    },

    audience: String,

    date: {
      type: Date,
      required: true,
    },

    time: String,
    venue: String,
    description: String,
    coverImage: String,

    // =============================
    // 📦 Resources
    // =============================
    resources: [
      {
        title: { type: String, required: true },
        type: {
          type: String,
          enum: ["pdf", "slides", "video", "code", "dataset"],
          default: "pdf",
        },
        url: { type: String, required: true },
        size: String,
        description: String,
      },
    ],

    // =============================
    // 👥 Enrollment System (NEW)
    // =============================
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    enrolledCount: {
      type: Number,
      default: 0,
    },

    maxParticipants: {
      type: Number,
      default: 50,
    },

    // =============================
    // 👤 Creator & Status
    // =============================
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    university: {
      type: String,
      default: "University of Blida 1",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Workshop", WorkshopSchema);
