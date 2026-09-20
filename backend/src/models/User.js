const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
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
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    resumeFileId: {
      type: String,
      default: "",
    },

    // Extracted resume text for AI features
    resumeText: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);