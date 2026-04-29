const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["industry", "rectorate", "academic"],
      required: true,
    },
    description: { type: String, required: true },
    logo: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Partner", PartnerSchema);
