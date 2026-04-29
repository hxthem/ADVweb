const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "representative", "admin"],
      default: "student",
    },

    department: {
      type: String,
    },

    aiFocus: {
      type: String,
      default: "General AI",
    },

    repStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },

    // 👇 مهم: منع التكرار باستخدام Set logic في الكود
    enrolledWorkshopIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workshop",
      },
    ],

    bio: {
      type: String,
      maxlength: 300,
    },

    avatar: {
      type: String,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// =============================
// 🔐 Hash Password (ضروري)
// =============================
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// =============================
// 🔑 Compare Password (login)
// =============================
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
