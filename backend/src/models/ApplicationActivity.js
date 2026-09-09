const mongoose = require("mongoose");

const applicationActivitySchema =
  new mongoose.Schema(
    {
      application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobApplication",
        required: true,
      },

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      type: {
        type: String,
        enum: [
          "created",
          "status_changed",
          "updated",
          "follow_up_completed",
          "note_added",
          "tag_added",
        ],
        required: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      oldStatus: {
        type: String,
        default: "",
      },

      newStatus: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "ApplicationActivity",
  applicationActivitySchema
);