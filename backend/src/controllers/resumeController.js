const ImageKit = require("../config/imagekit");
const User = require("../models/User");

const {
  extractResumeText,
} = require("../services/resumeTextService");

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

    // ==========================================
    // Extract Resume Text
    // ==========================================
    let resumeText = "";

    try {
      resumeText = await extractResumeText(
        req.file.buffer,
        req.file.mimetype
      );
    } catch (extractionError) {
      console.error(
        "Resume text extraction failed:",
        extractionError.message
      );

      return res.status(400).json({
        message:
          "Unable to read the resume text. Please upload a text-based PDF or DOCX resume.",
      });
    }

    // Make sure the resume actually contains text
    if (!resumeText.trim()) {
      return res.status(400).json({
        message:
          "No readable text was found in the resume. Please upload a text-based resume.",
      });
    }

    // ==========================================
    // Upload New Resume to ImageKit
    // ==========================================
    const result = await ImageKit.files.upload({
      file: req.file.buffer.toString("base64"),

      fileName: `resume-${req.user.userId}-${Date.now()}-${req.file.originalname}`,

      folder: "/jobtrack/resumes",
    });

    // ==========================================
    // Delete Old Resume From ImageKit
    // ==========================================
    if (user.resumeFileId) {
      try {
        await ImageKit.files.delete(
          user.resumeFileId
        );
      } catch (deleteError) {
        // Do not fail the new upload if old
        // file deletion fails
        console.error(
          "Old resume deletion failed:",
          deleteError.message
        );
      }
    }

    // ==========================================
    // Save Resume Information + Extracted Text
    // ==========================================
    user.resumeUrl = result.url;
    user.resumeFileId = result.fileId;
    user.resumeText = resumeText;

    await user.save();

    return res.json({
      message: "Resume uploaded successfully",

      resumeUrl: user.resumeUrl,

      resumeFileId: user.resumeFileId,

      resumeTextAvailable:
        Boolean(user.resumeText),
    });
  } catch (error) {
    console.error(
      "Resume upload error:",
      error
    );

    return res.status(500).json({
      message: "Resume upload failed",
    });
  }
};

// ==========================================
// Get Resume
// ==========================================
const getResume = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select(
      "resumeUrl resumeFileId resumeText"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      resumeUrl: user.resumeUrl || "",

      resumeFileId:
        user.resumeFileId || "",

      resumeTextAvailable:
        Boolean(user.resumeText),
    });
  } catch (error) {
    console.error(
      "Get resume error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch resume",
    });
  }
};

// ==========================================
// Delete Resume
// ==========================================
const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ==========================================
    // Delete Resume From ImageKit
    // ==========================================
    if (user.resumeFileId) {
      try {
        await ImageKit.files.delete(
          user.resumeFileId
        );
      } catch (deleteError) {
        console.error(
          "ImageKit resume deletion failed:",
          deleteError.message
        );
      }
    }

    // ==========================================
    // Remove Resume Information
    // ==========================================
    user.resumeUrl = "";
    user.resumeFileId = "";
    user.resumeText = "";

    await user.save();

    return res.json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete resume error:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete resume",
    });
  }
};

module.exports = {
  uploadResume,
  getResume,
  deleteResume,
};