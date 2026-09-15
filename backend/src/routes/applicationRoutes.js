const express = require("express");

const {
  createApplication,
  getApplications,
  searchApplications,
  getApplicationStats,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  updateApplicationTags,
  updateFollowUp,
  updateInterviewInfo,
  getApplicationTimeline,
  exportApplicationsCSV,
  deleteApplication,
   generateCalendarEvent,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// Main Application Routes
// ==========================================

router.post("/", protect, createApplication);

router.get("/", protect, getApplications);

// IMPORTANT:
// Specific routes must come before /:id
router.get("/search", protect, searchApplications);

router.get("/stats", protect, getApplicationStats);

router.get(
  "/export/csv",
  protect,
  exportApplicationsCSV
);

// ==========================================
// Feature Routes
// ==========================================

router.patch(
  "/:id/status",
  protect,
  updateApplicationStatus
);

router.patch(
  "/:id/tags",
  protect,
  updateApplicationTags
);

router.patch(
  "/:id/follow-up",
  protect,
  updateFollowUp
);

router.patch(
  "/:id/interview",
  protect,
  updateInterviewInfo
);

router.get(
  "/:id/timeline",
  protect,
  getApplicationTimeline
);

// ==========================================
// Existing CRUD
// ==========================================

router.get(
  "/:id",
  protect,
  getApplicationById
);

router.put(
  "/:id",
  protect,
  updateApplication
);

router.get(
  "/:id/calendar",
  protect,
  generateCalendarEvent
);

router.delete(
  "/:id",
  protect,
  deleteApplication
);


module.exports = router;