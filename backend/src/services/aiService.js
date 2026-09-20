const { GoogleGenAI } = require("@google/genai");

// ======================================================
// 1. JOB DESCRIPTION ANALYSIS SCHEMA
// ======================================================

const JOB_ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: {
      type: "string",
    },
    requiredSkills: {
      type: "array",
      items: {
        type: "string",
      },
    },
    preferredSkills: {
      type: "array",
      items: {
        type: "string",
      },
    },
    experienceRequired: {
      type: "string",
    },
    educationRequirements: {
      type: "string",
    },
    jobType: {
      type: "string",
    },
    keyResponsibilities: {
      type: "array",
      items: {
        type: "string",
      },
    },
    importantKeywords: {
      type: "array",
      items: {
        type: "string",
      },
    },
    technologies: {
      type: "array",
      items: {
        type: "string",
      },
    },
    experienceLevel: {
      type: "string",
    },
  },
  required: [
    "summary",
    "requiredSkills",
    "preferredSkills",
    "experienceRequired",
    "educationRequirements",
    "jobType",
    "keyResponsibilities",
    "importantKeywords",
    "technologies",
    "experienceLevel",
  ],
};

// ======================================================
// 2. RESUME MATCHING SCHEMA
// ======================================================

const RESUME_MATCHING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchScore: {
      type: "number",
    },
    matchedSkills: {
      type: "array",
      items: {
        type: "string",
      },
    },
    missingSkills: {
      type: "array",
      items: {
        type: "string",
      },
    },
    strengths: {
      type: "array",
      items: {
        type: "string",
      },
    },
    experienceMatch: {
      type: "string",
    },
    educationMatch: {
      type: "string",
    },
    assessment: {
      type: "string",
    },
  },
  required: [
    "matchScore",
    "matchedSkills",
    "missingSkills",
    "strengths",
    "experienceMatch",
    "educationMatch",
    "assessment",
  ],
};

// ======================================================
// 3. SKILL GAP SCHEMA
// ======================================================

const SKILL_GAP_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredSkills: {
      type: "array",
      items: {
        type: "string",
      },
    },
    matchedSkills: {
      type: "array",
      items: {
        type: "string",
      },
    },
    missingSkills: {
      type: "array",
      items: {
        type: "string",
      },
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          skill: {
            type: "string",
          },
          priority: {
            type: "string",
            enum: ["High", "Medium", "Low"],
          },
          reason: {
            type: "string",
          },
        },
        required: ["skill", "priority", "reason"],
      },
    },
    summary: {
      type: "string",
    },
  },
  required: [
    "requiredSkills",
    "matchedSkills",
    "missingSkills",
    "skillGaps",
    "summary",
  ],
};

// ======================================================
// 4. INTERVIEW PREPARATION SCHEMA
// ======================================================

const INTERVIEW_PREP_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: {
            type: "string",
          },
          difficulty: {
            type: "string",
            enum: ["Easy", "Medium", "Hard"],
          },
          topic: {
            type: "string",
          },
          whatInterviewerEvaluates: {
            type: "string",
          },
          answerPoints: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: [
          "question",
          "difficulty",
          "topic",
          "whatInterviewerEvaluates",
          "answerPoints",
        ],
      },
    },

    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: {
            type: "string",
          },
          whatInterviewerEvaluates: {
            type: "string",
          },
          answerPoints: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: [
          "question",
          "whatInterviewerEvaluates",
          "answerPoints",
        ],
      },
    },

    resumeBasedQuestions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          question: {
            type: "string",
          },
          reason: {
            type: "string",
          },
          answerPoints: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["question", "reason", "answerPoints"],
      },
    },

    preparationSummary: {
      type: "string",
    },
  },
  required: [
    "technicalQuestions",
    "behavioralQuestions",
    "resumeBasedQuestions",
    "preparationSummary",
  ],
};

// ======================================================
// 5. PERSONALIZED RECOMMENDATIONS SCHEMA
// ======================================================

const RECOMMENDATIONS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    profileSummary: {
      type: "string",
    },

    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          area: {
            type: "string",
            enum: [
              "Resume",
              "Skills",
              "Projects",
              "Interview",
              "Job Application",
            ],
          },
          recommendation: {
            type: "string",
          },
          reason: {
            type: "string",
          },
          priority: {
            type: "string",
            enum: ["High", "Medium", "Low"],
          },
        },
        required: [
          "area",
          "recommendation",
          "reason",
          "priority",
        ],
      },
    },

    strengths: {
      type: "array",
      items: {
        type: "string",
      },
    },

    focusAreas: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: [
    "profileSummary",
    "recommendations",
    "strengths",
    "focusAreas",
  ],
};

// ======================================================
// OPENAI CLIENT
// ======================================================

function createGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("Gemini API key is not configured");
    error.code = "AI_NOT_CONFIGURED";
    throw error;
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
}

// ======================================================
// COMMON VALIDATION
// ======================================================

function validateResumeAndJob(resumeText, jobDescription) {
  if (typeof resumeText !== "string" || !resumeText.trim()) {
    const error = new Error("Resume text is required");
    error.code = "INVALID_RESUME_TEXT";
    throw error;
  }

  if (
    typeof jobDescription !== "string" ||
    !jobDescription.trim()
  ) {
    const error = new Error("Job description is required");
    error.code = "INVALID_JOB_DESCRIPTION";
    throw error;
  }
}

// ======================================================
// COMMON AI ERROR NORMALIZATION
// ======================================================

function normalizeAIError(error) {
  if (!error) {
    const normalized = new Error("Unknown AI error");
    normalized.code = "AI_SERVICE_ERROR";
    return normalized;
  }

  // TEMPORARY DEBUGGING
  console.error("========== AI PROVIDER ERROR ==========");
  console.error("status:", error.status);
  console.error("code:", error.code);
  console.error("message:", error.message);
  console.error("type:", error.type);
  console.error("param:", error.param);
  console.error("request_id:", error.request_id);
  console.error("response:", error.response?.data);
  console.error("full error:", error);
  console.error("========================================");

  if (error.code === "AI_NOT_CONFIGURED") {
    return error;
  }

  if (error.code === "INVALID_RESUME_TEXT") {
    return error;
  }

  if (error.code === "INVALID_JOB_DESCRIPTION") {
    return error;
  }

  if (
    error.status === 429 ||
    error.code === "rate_limit_exceeded"
  ) {
    const normalized = new Error("AI rate limit reached");
    normalized.code = "AI_RATE_LIMIT";
    return normalized;
  }

  if (
    error.status === 401 ||
    error.code === "invalid_api_key"
  ) {
    const normalized = new Error("AI authentication failed");
    normalized.code = "AI_AUTHENTICATION_ERROR";
    return normalized;
  }

  if (
    error.status === 500 ||
    error.status === 502 ||
    error.status === 503
  ) {
    const normalized = new Error("AI service unavailable");
    normalized.code = "AI_SERVICE_UNAVAILABLE";
    return normalized;
  }

  if (
    error.code === "ETIMEDOUT" ||
    error.code === "ECONNRESET" ||
    error.code === "ECONNREFUSED" ||
    error.name === "APIConnectionError"
  ) {
    const normalized = new Error(
      "Could not connect to AI service"
    );
    normalized.code = "AI_CONNECTION_ERROR";
    return normalized;
  }

  const normalized = new Error("AI service error");
  normalized.code = "AI_SERVICE_ERROR";
  return normalized;
}
// ======================================================
// 1. ANALYZE JOB DESCRIPTION
// ======================================================

async function analyzeJobDescription(jobDescription) {
  try {
    if (
      typeof jobDescription !== "string" ||
      !jobDescription.trim()
    ) {
      const error = new Error("Job description is required");
      error.code = "INVALID_JOB_DESCRIPTION";
      throw error;
    }

    const ai = createGeminiClient();

    const prompt = `
You are an AI career assistant inside JobTrack.

Analyze the following job description carefully.

Return ONLY valid JSON matching this structure:

{
  "summary": "short summary of the job",
  "requiredSkills": [],
  "preferredSkills": [],
  "experienceRequired": "",
  "educationRequirements": "",
  "jobType": "",
  "keyResponsibilities": [],
  "importantKeywords": [],
  "technologies": [],
  "experienceLevel": ""
}

Rules:
- Use only information present in the job description.
- Do not invent requirements.
- requiredSkills = skills explicitly required.
- preferredSkills = preferred/nice-to-have skills.
- importantKeywords = important keywords recruiters may look for.
- technologies = programming languages, frameworks, databases, tools, platforms, etc.
- Keep the answer concise and useful.

JOB DESCRIPTION:
${jobDescription}
`;

    const response = await ai.models.generateContent({
   model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      const error = new Error("AI returned an empty response");
      error.code = "AI_EMPTY_RESPONSE";
      throw error;
    }

    return JSON.parse(text);
  } catch (error) {
    throw normalizeAIError(error);
  }
}

// ======================================================
// 2. RESUME ↔ JOB MATCHING
// ======================================================

async function matchResumeWithJob(resumeText, jobDescription) {
  try {
    validateResumeAndJob(resumeText, jobDescription);

    const ai = createGeminiClient();

    const prompt = `
You are an AI career assistant inside JobTrack.

Compare the candidate's resume with the provided job description.

Return ONLY valid JSON in exactly this structure:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "experienceMatch": "",
  "educationMatch": "",
  "assessment": ""
}

Rules:
- matchScore must be a number from 0 to 100.
- matchedSkills = skills clearly present in the resume and relevant to the job.
- missingSkills = important job requirements not clearly present in the resume.
- strengths = relevant strengths supported by the resume.
- Do not invent experience, education, skills, projects, or achievements.
- experienceMatch should explain how the candidate's stated experience compares with the job requirements.
- educationMatch should explain how the stated education compares with the job requirements.
- Keep the assessment concise and factual.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      const error = new Error("AI returned an empty response");
      error.code = "AI_EMPTY_RESPONSE";
      throw error;
    }

    return JSON.parse(text);
  } catch (error) {
    throw normalizeAIError(error);
  }
}
// ======================================================
// 3. SKILL GAP ANALYSIS
// ======================================================

async function analyzeSkillGap(resumeText, jobDescription) {
  try {
    validateResumeAndJob(resumeText, jobDescription);

    const ai = createGeminiClient();

    const prompt = `
You are an AI career assistant inside JobTrack.

Analyze the skill gap between the candidate's resume and the provided job description.

Return ONLY valid JSON in exactly this structure:

{
  "requiredSkills": [],
  "matchedSkills": [],
  "missingSkills": [],
  "skillGaps": [
    {
      "skill": "",
      "priority": "High",
      "reason": ""
    }
  ],
  "summary": ""
}

Rules:
- requiredSkills = important skills explicitly required or strongly expected in the job description.
- matchedSkills = required skills clearly supported by the resume.
- missingSkills = important required skills not clearly supported by the resume.
- skillGaps must contain only genuine gaps.
- priority must be exactly one of: High, Medium, Low.
- Do not invent skills, experience, projects, or qualifications.
- Base every conclusion only on the resume and job description.
- Keep the summary concise and useful.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      const error = new Error("AI returned an empty response");
      error.code = "AI_EMPTY_RESPONSE";
      throw error;
    }

    return JSON.parse(text);
  } catch (error) {
    throw normalizeAIError(error);
  }
}

// ======================================================
// 4. AI INTERVIEW PREPARATION
// ======================================================

async function generateInterviewPreparation(resumeText, jobDescription) {
  try {
    validateResumeAndJob(resumeText, jobDescription);

    const ai = createGeminiClient();

    const prompt = `
You are an AI career assistant inside JobTrack.

Generate interview preparation material based ONLY on the candidate's resume
and the provided job description.

Return ONLY valid JSON in exactly this structure:

{
  "technicalQuestions": [
    {
      "question": "",
      "difficulty": "Easy",
      "topic": "",
      "whatInterviewerEvaluates": "",
      "answerPoints": []
    }
  ],
  "behavioralQuestions": [
    {
      "question": "",
      "answerPoints": []
    }
  ],
  "resumeBasedQuestions": [
    {
      "question": "",
      "answerPoints": []
    }
  ],
  "preparationSummary": ""
}

Rules:
- Generate relevant technical questions based on the technologies,
  skills and responsibilities mentioned in the job description.
- Generate behavioral questions relevant to the role.
- Generate resume-based questions ONLY from information actually present
  in the resume.
- difficulty for technical questions must be exactly:
  Easy, Medium, or Hard.
- answerPoints should contain concise points the candidate should cover.
- Do not invent projects, skills, experience, achievements, education,
  or technologies.
- Do not assume information that is not present.
- Keep the questions practical and interview-focused.
- Keep the preparation summary concise.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      const error = new Error("AI returned an empty response");
      error.code = "AI_EMPTY_RESPONSE";
      throw error;
    }

    return JSON.parse(text);
  } catch (error) {
    throw normalizeAIError(error);
  }
}

// ======================================================
// 5. PERSONALIZED RECOMMENDATIONS
// ======================================================

async function generateRecommendations(resumeText, jobDescription) {
  try {
    validateResumeAndJob(resumeText, jobDescription);

    const ai = createGeminiClient();

    const prompt = `
You are an AI career assistant inside JobTrack.

Analyze the candidate's resume against the provided job description and
generate personalized career recommendations.

Return ONLY valid JSON in exactly this structure:

{
  "profileSummary": "",
  "recommendations": [
    {
      "area": "Resume",
      "recommendation": "",
      "reason": "",
      "priority": "High"
    }
  ],
  "strengths": [],
  "focusAreas": []
}

Rules:
- area must be exactly one of:
  Resume, Skills, Projects, Interview, Job Application.
- priority must be exactly one of:
  High, Medium, Low.
- recommendations must be specific and actionable.
- strengths must be supported by the resume.
- focusAreas should identify the most useful areas for improvement
  based on the job requirements.
- Do not invent skills, projects, experience, achievements, education,
  or qualifications.
- Base all recommendations only on the resume and job description.
- Keep recommendations concise and practical.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      const error = new Error("AI returned an empty response");
      error.code = "AI_EMPTY_RESPONSE";
      throw error;
    }

    return JSON.parse(text);
  } catch (error) {
    throw normalizeAIError(error);
  }
}
// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  analyzeJobDescription,
  matchResumeWithJob,
  analyzeSkillGap,
  generateInterviewPreparation,
  generateRecommendations,
};