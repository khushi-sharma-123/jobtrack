
const ImageKit = require("../config/imagekit");
const User = require("../models/User");

// ==========================================
// Upload / Replace Resume
// ==========================================
const uploadResume = async (req, res) => {
  try {
    // Check if file was selected
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a resume file",
      });
    }

    // Find current user
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Upload new resume to ImageKit
    const result = await ImageKit.files.upload({
      file: req.file.buffer.toString("base64"),

      fileName: `resume-${req.user.userId}-${Date.now()}-${req.file.originalname}`,

      folder: "/jobtrack/resumes",
    });

    // Delete old resume from ImageKit
    if (user.resumeFileId) {
      try {
        await ImageKit.files.delete(user.resumeFileId);
      } catch (deleteError) {
        // Do not fail the new upload if old file deletion fails
        console.error(
          "Old resume deletion failed:",
          deleteError.message
        );
      }
    }

    // Save new resume information in MongoDB
    user.resumeUrl = result.url;
    user.resumeFileId = result.fileId;

    await user.save();

    res.json({
      message: "Resume uploaded successfully",
      resumeUrl: user.resumeUrl,
      resumeFileId: user.resumeFileId,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    res.status(500).json({
      message: "Resume upload failed",
    });
  }
};

// ==========================================
// Get Resume
// ==========================================
const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "resumeUrl resumeFileId"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      resumeUrl: user.resumeUrl || "",
      resumeFileId: user.resumeFileId || "",
    });
  } catch (error) {
    console.error("Get resume error:", error);

    res.status(500).json({
      message: "Failed to fetch resume",
    });
  }
};

// ==========================================
// Delete Resume
// ==========================================
const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete resume from ImageKit
    if (user.resumeFileId) {
      try {
        await ImageKit.files.delete(user.resumeFileId);
      } catch (deleteError) {
        console.error(
          "ImageKit resume deletion failed:",
          deleteError.message
        );
      }
    }

    // Remove resume information from MongoDB
    user.resumeUrl = "";
    user.resumeFileId = "";

    await user.save();

    res.json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    res.status(500).json({
      message: "Failed to delete resume",
    });
  }
};

module.exports = {
  uploadResume,
  getResume,
  deleteResume,
};

