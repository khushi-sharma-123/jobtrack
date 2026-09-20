const express = require("express");

const {
  sendFollowUpEmail,
} = require("../controllers/applicationController");

const  protect  = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// Send Follow-Up Email
// ==========================================

router.post(
  "/send",
  protect,
  sendFollowUpEmail
);

module.exports = router;