const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },

    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected", "Selected"],
      default: "Applied",
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    followUpCompleted: {
      type: Boolean,
      default: false,
    },

    jobUrl: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    // ==============================
    // Application Tags
    // ==============================
    tags: {
      type: [String],
      default: [],
    },

    // ==============================
    // Recruiter Information
    // ==============================
    recruiterName: {
      type: String,
      trim: true,
      default: "",
    },

    recruiterEmail: {
      type: String,
      trim: true,
      default: "",
    },

    recruiterPhone: {
      type: String,
      trim: true,
      default: "",
    },

    recruiterLinkedin: {
      type: String,
      trim: true,
      default: "",
    },

    // ==============================
    // Interview Notes
    // ==============================
    interviewNotes: {
      type: String,
      trim: true,
      default: "",
    },

    // ==============================
    // Interview Scheduling
    // ==============================
    interviewDate: {
      type: Date,
      default: null,
    },

    interviewDuration: {
      type: Number,
      default: 60,
      min: 15,
    },

    interviewType: {
      type: String,
      enum: ["Online", "Offline", "Phone"],
      default: "Online",
    },

    interviewLocation: {
      type: String,
      trim: true,
      default: "",
    },

    // ==============================
    // Interview Reminder
    // ==============================
    interviewReminderSent: {
      type: Boolean,
      default: false,
    },

    // ==============================
    // Calendar Integration
    // ==============================
    calendarEventId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);