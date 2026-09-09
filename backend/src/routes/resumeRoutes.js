
const express = require("express");
const multer = require("multer");

const protect = require("../middleware/authMiddleware");

const {
  uploadResume,
  getResume,
  deleteResume,
} = require("../controllers/resumeController");

const router = express.Router();

// ==========================================
// Allowed Resume File Types
// ==========================================
const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// ==========================================
// Multer Configuration
// ==========================================
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
  },
});

// ==========================================
// Get Current Resume
// ==========================================
router.get("/", protect, getResume);

// ==========================================
// Upload / Replace Resume
// ==========================================
router.post(
  "/",
  protect,
  upload.single("resume"),
  uploadResume
);

// ==========================================
// Delete Resume
// ==========================================
router.delete("/", protect, deleteResume);

// ==========================================
// Multer Error Handler
// ==========================================
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Resume file must be smaller than 5 MB",
      });
    }

    return res.status(400).json({
      message: "Resume upload failed",
    });
  }

  if (error) {
    return res.status(400).json({
      message: error.message || "Invalid resume file",
    });
  }

  next();
});

module.exports = router;

