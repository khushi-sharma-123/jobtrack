// const express = require("express");

// const protect = require("../middleware/authMiddleware");

// const User = require("../models/User");

// const {
//   analyzeJobDescription,
//   matchResumeWithJob,
//   analyzeSkillGap,
// } = require("../services/aiService");
// const {
//   prepareResumeText,
// } = require("../services/resumeTextService");

// const router = express.Router();

// // ==========================================
// // Constants
// // ==========================================

// const MIN_JOB_DESCRIPTION_LENGTH = 50;
// const MAX_JOB_DESCRIPTION_LENGTH = 15000;

// // ==========================================
// // Analyze Job Description
// // ==========================================

// router.post(
//   "/analyze-job",
//   protect,
//   async (req, res) => {
//     try {
//       const { jobDescription } = req.body;

//       // Validate input type and empty values
//       if (
//         typeof jobDescription !== "string" ||
//         !jobDescription.trim()
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Job description is required",
//         });
//       }

//       const cleanedJobDescription =
//         jobDescription.trim();

//       // Minimum length validation
//       if (
//         cleanedJobDescription.length <
//         MIN_JOB_DESCRIPTION_LENGTH
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Job description is too short. Please provide a complete job description.",
//         });
//       }

//       // Maximum length validation
//       if (
//         cleanedJobDescription.length >
//         MAX_JOB_DESCRIPTION_LENGTH
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Job description is too long. Please keep it under 15,000 characters.",
//         });
//       }

//       const analysis =
//         await analyzeJobDescription(
//           cleanedJobDescription
//         );

//       return res.status(200).json({
//         success: true,
//         analysis,
//       });
//     } catch (error) {
//       console.error(
//         "AI job description analysis error:",
//         error.code || "UNKNOWN_ERROR"
//       );

//       switch (error.code) {
//         case "AI_NOT_CONFIGURED":
//           return res.status(503).json({
//             success: false,
//             message:
//               "AI service is not configured. Please try again later.",
//           });

//         case "AI_RATE_LIMIT":
//           return res.status(429).json({
//             success: false,
//             message:
//               "AI request limit reached. Please try again later.",
//           });

//         case "AI_AUTHENTICATION_ERROR":
//           return res.status(503).json({
//             success: false,
//             message:
//               "AI service authentication is unavailable.",
//           });

//         case "AI_SERVICE_UNAVAILABLE":
//           return res.status(503).json({
//             success: false,
//             message:
//               "AI service is temporarily unavailable. Please try again later.",
//           });

//         case "AI_CONNECTION_ERROR":
//           return res.status(503).json({
//             success: false,
//             message:
//               "Unable to connect to the AI service. Please try again later.",
//           });

//         case "AI_EMPTY_RESPONSE":
//         case "AI_INVALID_RESPONSE":
//           return res.status(502).json({
//             success: false,
//             message:
//               "AI returned an unexpected response. Please try again.",
//           });

//         case "INVALID_JOB_DESCRIPTION":
//           return res.status(400).json({
//             success: false,
//             message:
//               "Invalid job description",
//           });

//         default:
//           return res.status(500).json({
//             success: false,
//             message:
//               "Unable to analyze the job description",
//           });
//       }
//     }
//   }
// );

// // ==========================================
// // Resume vs Job Matching
// // ==========================================

// router.post(
//   "/match-resume",
//   protect,
//   async (req, res) => {
//     try {
//       const { jobDescription } = req.body;

//       // ==========================================
//       // Validate Job Description
//       // ==========================================

//       if (
//         typeof jobDescription !== "string" ||
//         !jobDescription.trim()
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Job description is required",
//         });
//       }

//       const cleanedJobDescription =
//         jobDescription.trim();

//       if (
//         cleanedJobDescription.length <
//         MIN_JOB_DESCRIPTION_LENGTH
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Job description is too short. Please provide a complete job description.",
//         });
//       }

//       if (
//         cleanedJobDescription.length >
//         MAX_JOB_DESCRIPTION_LENGTH
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Job description is too long. Please keep it under 15,000 characters.",
//         });
//       }

//       // POST /api/ai/skill-gap
// router.post("/skill-gap", protect, async (req, res) => {
//   try {
//     const { jobDescription } = req.body;

//     // Validate job description
//     if (typeof jobDescription !== "string") {
//       return res.status(400).json({
//         success: false,
//         message: "Job description must be a string",
//       });
//     }

//     const cleanedJobDescription = jobDescription.trim();

//     if (cleanedJobDescription.length < MIN_JOB_DESCRIPTION_LENGTH) {
//       return res.status(400).json({
//         success: false,
//         message: `Job description must be at least ${MIN_JOB_DESCRIPTION_LENGTH} characters`,
//       });
//     }

//     if (cleanedJobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
//       return res.status(400).json({
//         success: false,
//         message: `Job description must not exceed ${MAX_JOB_DESCRIPTION_LENGTH} characters`,
//       });
//     }

//     // Get logged-in user's resume
//     const user = await User.findById(req.user.userId).select("resumeText");

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (!user.resumeText) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload a resume before using skill gap analysis",
//       });
//     }

//     // Prepare resume text
//     const preparedResumeText = prepareResumeText(user.resumeText);

//     // AI skill gap analysis
//     const skillGap = await analyzeSkillGap(
//       preparedResumeText,
//       cleanedJobDescription
//     );

//     return res.status(200).json({
//       success: true,
//       skillGap,
//     });
//   } catch (error) {
//     console.error("Skill gap analysis error:", error);

//     switch (error.code) {
//       case "AI_NOT_CONFIGURED":
//         return res.status(503).json({
//           success: false,
//           message: "AI service is not configured",
//         });

//       case "AI_RATE_LIMIT":
//         return res.status(429).json({
//           success: false,
//           message: "AI rate limit reached. Please try again later.",
//         });

//       case "AI_AUTHENTICATION_ERROR":
//         return res.status(503).json({
//           success: false,
//           message: "AI authentication failed",
//         });

//       case "AI_SERVICE_UNAVAILABLE":
//         return res.status(503).json({
//           success: false,
//           message: "AI service is temporarily unavailable",
//         });

//       case "AI_CONNECTION_ERROR":
//         return res.status(503).json({
//           success: false,
//           message: "Could not connect to AI service",
//         });

//       case "AI_EMPTY_RESPONSE":
//       case "AI_INVALID_RESPONSE":
//         return res.status(502).json({
//           success: false,
//           message: "AI returned an invalid response",
//         });

//       case "INVALID_JOB_DESCRIPTION":
//       case "INVALID_RESUME_TEXT":
//         return res.status(400).json({
//           success: false,
//           message: error.message,
//         });

//       default:
//         return res.status(500).json({
//           success: false,
//           message: "Failed to analyze skill gap",
//         });
//     }
//   }
// });

//       // ==========================================
//       // Find Current User
//       // ==========================================

//       const user = await User.findById(
//         req.user.userId
//       ).select("resumeText");

//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       // ==========================================
//       // Check Resume
//       // ==========================================

//       if (
//         typeof user.resumeText !== "string" ||
//         !user.resumeText.trim()
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Please upload your resume before using resume matching.",
//         });
//       }

//       // ==========================================
//       // Prepare Resume Text
//       // ==========================================

//       let preparedResumeText;

//       try {
//         preparedResumeText =
//           prepareResumeText(
//             user.resumeText
//           );
//       } catch (resumeError) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Your stored resume text is not available or readable.",
//         });
//       }

//       // ==========================================
//       // AI Resume Matching
//       // ==========================================

//       const matching =
//         await matchResumeWithJob(
//           preparedResumeText,
//           cleanedJobDescription
//         );

//       // ==========================================
//       // Response
//       // ==========================================

//       return res.status(200).json({
//         success: true,
//         matching,
//       });
//     } catch (error) {
//       console.error(
//         "AI resume matching error:",
//         error.code || "UNKNOWN_ERROR"
//       );

//       switch (error.code) {
//         case "AI_NOT_CONFIGURED":
//           return res.status(503).json({
//             success: false,
//             message:
//               "AI service is not configured. Please try again later.",
//           });

//         case "AI_RATE_LIMIT":
//           return res.status(429).json({
//             success: false,
//             message:
//               "AI request limit reached. Please try again later.",
//           });

//         case "AI_AUTHENTICATION_ERROR":
//           return res.status(503).json({
//             success: false,
//             message:
//               "AI service authentication is unavailable.",
//           });

//         case "AI_SERVICE_UNAVAILABLE":
//           return res.status(503).json({
//             success: false,
//             message:
//               "AI service is temporarily unavailable. Please try again later.",
//           });

//         case "AI_CONNECTION_ERROR":
//           return res.status(503).json({
//             success: false,
//             message:
//               "Unable to connect to the AI service. Please try again later.",
//           });

//         case "AI_EMPTY_RESPONSE":
//         case "AI_INVALID_RESPONSE":
//           return res.status(502).json({
//             success: false,
//             message:
//               "AI returned an unexpected response. Please try again.",
//           });

//         case "INVALID_RESUME_TEXT":
//           return res.status(400).json({
//             success: false,
//             message:
//               "Resume text is invalid.",
//           });

//         case "INVALID_JOB_DESCRIPTION":
//           return res.status(400).json({
//             success: false,
//             message:
//               "Invalid job description.",
//           });

//         default:
//           return res.status(500).json({
//             success: false,
//             message:
//               "Unable to match the resume with the job description.",
//           });
//       }
//     }
//   }
// );

// module.exports = router;


const express = require("express");
const router = express.Router();

 const protect = require("../middleware/authMiddleware");

const User = require("../models/User");

const {
  prepareResumeText,
} = require("../services/resumeTextService");

const {
  analyzeJobDescription,
  matchResumeWithJob,
  analyzeSkillGap,
  generateInterviewPreparation,
  generateRecommendations,
} = require("../services/aiService");

// ======================================================
// CONSTANTS
// ======================================================

const MIN_JOB_DESCRIPTION_LENGTH = 50;
const MAX_JOB_DESCRIPTION_LENGTH = 15000;

// ======================================================
// COMMON JOB DESCRIPTION VALIDATION
// ======================================================

function validateJobDescription(jobDescription) {
  if (typeof jobDescription !== "string") {
    const error = new Error(
      "Job description must be a string"
    );
    error.code = "INVALID_JOB_DESCRIPTION";
    throw error;
  }

  const cleanedJobDescription =
    jobDescription.trim();

  if (
    cleanedJobDescription.length <
    MIN_JOB_DESCRIPTION_LENGTH
  ) {
    const error = new Error(
      `Job description must be at least ${MIN_JOB_DESCRIPTION_LENGTH} characters`
    );
    error.code = "INVALID_JOB_DESCRIPTION";
    throw error;
  }

  if (
    cleanedJobDescription.length >
    MAX_JOB_DESCRIPTION_LENGTH
  ) {
    const error = new Error(
      `Job description must not exceed ${MAX_JOB_DESCRIPTION_LENGTH} characters`
    );
    error.code = "INVALID_JOB_DESCRIPTION";
    throw error;
  }

  return cleanedJobDescription;
}

// ======================================================
// COMMON USER RESUME FETCH
// ======================================================

async function getPreparedResume(req) {
  const user = await User.findById(
    req.user.userId
  ).select("resumeText");

  if (!user) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  if (!user.resumeText) {
    const error = new Error(
      "Please upload a resume before using this AI feature"
    );
    error.code = "RESUME_NOT_FOUND";
    throw error;
  }

  return prepareResumeText(user.resumeText);
}

// ======================================================
// COMMON ERROR RESPONSE
// ======================================================

function handleAIError(error, res, defaultMessage) {
  console.error("AI route error:", error);

  switch (error.code) {
    case "AI_NOT_CONFIGURED":
      return res.status(503).json({
        success: false,
        message: "AI service is not configured",
      });

    case "AI_RATE_LIMIT":
      return res.status(429).json({
        success: false,
        message:
          "AI rate limit reached. Please try again later.",
      });

    case "AI_AUTHENTICATION_ERROR":
      return res.status(503).json({
        success: false,
        message: "AI authentication failed",
      });

    case "AI_SERVICE_UNAVAILABLE":
      return res.status(503).json({
        success: false,
        message:
          "AI service is temporarily unavailable",
      });

    case "AI_CONNECTION_ERROR":
      return res.status(503).json({
        success: false,
        message:
          "Could not connect to AI service",
      });

    case "AI_EMPTY_RESPONSE":
    case "AI_INVALID_RESPONSE":
      return res.status(502).json({
        success: false,
        message:
          "AI returned an invalid response",
      });

    case "INVALID_JOB_DESCRIPTION":
    case "INVALID_RESUME_TEXT":
      return res.status(400).json({
        success: false,
        message: error.message,
      });

    case "USER_NOT_FOUND":
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    case "RESUME_NOT_FOUND":
      return res.status(400).json({
        success: false,
        message: error.message,
      });

    default:
      return res.status(500).json({
        success: false,
        message: defaultMessage,
      });
  }
}

// ======================================================
// 1. JOB DESCRIPTION ANALYSIS
// POST /api/ai/analyze-job
// ======================================================

router.post(
  "/analyze-job",
  protect,
  async (req, res) => {
    try {
      const jobDescription =
        validateJobDescription(
          req.body.jobDescription
        );

      const analysis =
        await analyzeJobDescription(
          jobDescription
        );

      return res.status(200).json({
        success: true,
        analysis,
      });
    } catch (error) {
      return handleAIError(
        error,
        res,
        "Failed to analyze job description"
      );
    }
  }
);

// ======================================================
// 2. RESUME ↔ JOB MATCHING
// POST /api/ai/match-resume
// ======================================================

router.post(
  "/match-resume",
  protect,
  async (req, res) => {
    try {
      const jobDescription =
        validateJobDescription(
          req.body.jobDescription
        );

      const resumeText =
        await getPreparedResume(req);

      const matching =
        await matchResumeWithJob(
          resumeText,
          jobDescription
        );

      return res.status(200).json({
        success: true,
        matching,
      });
    } catch (error) {
      return handleAIError(
        error,
        res,
        "Failed to match resume with job"
      );
    }
  }
);

// ======================================================
// 3. SKILL GAP ANALYSIS
// POST /api/ai/skill-gap
// ======================================================

router.post(
  "/skill-gap",
  protect,
  async (req, res) => {
    try {
      const jobDescription =
        validateJobDescription(
          req.body.jobDescription
        );

      const resumeText =
        await getPreparedResume(req);

      const skillGap =
        await analyzeSkillGap(
          resumeText,
          jobDescription
        );

      return res.status(200).json({
        success: true,
        skillGap,
      });
    } catch (error) {
      return handleAIError(
        error,
        res,
        "Failed to analyze skill gap"
      );
    }
  }
);

// ======================================================
// 4. AI INTERVIEW PREPARATION
// POST /api/ai/interview-prep
// ======================================================

router.post(
  "/interview-prep",
  protect,
  async (req, res) => {
    try {
      const jobDescription =
        validateJobDescription(
          req.body.jobDescription
        );

      const resumeText =
        await getPreparedResume(req);

      const interviewPrep =
        await generateInterviewPreparation(
          resumeText,
          jobDescription
        );

      return res.status(200).json({
        success: true,
        interviewPrep,
      });
    } catch (error) {
      return handleAIError(
        error,
        res,
        "Failed to generate interview preparation"
      );
    }
  }
);

// ======================================================
// 5. PERSONALIZED RECOMMENDATIONS
// POST /api/ai/recommendations
// ======================================================

router.post(
  "/recommendations",
  protect,
  async (req, res) => {
    try {
      const jobDescription =
        validateJobDescription(
          req.body.jobDescription
        );

      const resumeText =
        await getPreparedResume(req);

      const recommendations =
        await generateRecommendations(
          resumeText,
          jobDescription
        );

      return res.status(200).json({
        success: true,
        recommendations,
      });
    } catch (error) {
      return handleAIError(
        error,
        res,
        "Failed to generate personalized recommendations"
      );
    }
  }
);

// ======================================================
// EXPORT
// ======================================================

module.exports = router;