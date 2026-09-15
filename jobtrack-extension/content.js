// ==========================================
// JobTrack Content Script
// ==========================================

console.log(
  "JobTrack content script loaded"
);

// ==========================================
// Get Detected Website
// ==========================================
const getDetectedSite = () => {
  if (
    window.JobTrackSiteDetector
  ) {
    return window
      .JobTrackSiteDetector
      .detectJobSite();
  }

  return "generic";
};

// ==========================================
// Extract Job Details
// ==========================================
const getJobDetails = () => {
  const site =
    getDetectedSite();

  let jobData = null;

  // ==========================================
  // Site-Specific Extraction
  // ==========================================
  try {
    if (
      site === "naukri" &&
      typeof extractNaukriJobData ===
        "function"
    ) {
      jobData =
        extractNaukriJobData();
    }

    if (
      site === "indeed" &&
      typeof extractIndeedJobData ===
        "function"
    ) {
      jobData =
        extractIndeedJobData();
    }

    if (
      site === "linkedin" &&
      typeof extractLinkedInJobData ===
        "function"
    ) {
      jobData =
        extractLinkedInJobData();
    }
  } catch (error) {
    console.error(
      "JobTrack: Site-specific extraction failed:",
      error
    );

    jobData = null;
  }

  // ==========================================
  // Validate Site-Specific Extraction
  // ==========================================
  const siteExtractionUsable =
    jobData &&
    jobData.company &&
    jobData.position;

  // ==========================================
  // Generic Fallback
  // ==========================================
  if (
    !siteExtractionUsable &&
    typeof extractGenericJobData ===
      "function"
  ) {
    console.log(
      "JobTrack: Using generic extractor fallback."
    );

    try {
      jobData =
        extractGenericJobData();
    } catch (error) {
      console.error(
        "JobTrack: Generic extraction failed:",
        error
      );

      jobData = null;
    }
  }

  if (!jobData) {
    return {
      company: "",
      position: "",
      location: "",
      jobType: "",
      jobUrl:
        window.location.href,
      appliedDate:
        new Date().toISOString(),
      source:
        window.location.hostname,
      confidence: {},
      extractionMethod: {},
      isJobBoard: false,
      description: "",
      detectedSite: site,
    };
  }

  return {
    company:
      jobData.company || "",

    position:
      jobData.position || "",

    location:
      jobData.location || "",

    jobType:
      jobData.jobType || "",

    jobUrl:
      jobData.jobUrl ||
      window.location.href,

    appliedDate:
      jobData.appliedDate ||
      new Date().toISOString(),

    source:
      jobData.source ||
      window.location.hostname,

    confidence:
      jobData.confidence || {},

    extractionMethod:
      jobData.extractionMethod || {},

    isJobBoard:
      jobData.isJobBoard || false,

    description:
      jobData.description || "",

    detectedSite: site,
  };
};

// ==========================================
// Application Success Patterns
// ==========================================
const SUCCESS_PATTERNS = [
  "your application was successfully submitted",
  "application submitted",
  "application received",
  "you've applied",
  "you have applied",
  "your application has been sent",
  "thanks for applying",
  "thank you for applying",
  "successfully applied",
  "application complete",
  "application was submitted",
  "application has been submitted",
  "your application is complete",
  "your application has been received",
  "you successfully applied",
  "application successful",
];

// ==========================================
// Confirmation URL Patterns
// ==========================================
const SUCCESS_URL_PATTERNS = [
  "application-submitted",
  "application_submitted",
  "application-submission",
  "application_submission",
  "application-success",
  "application_success",
  "application-confirmation",
  "application_confirmation",
  "thank-you",
  "thank_you",
  "confirmation",
  "success",
  "submitted",
];

// ==========================================
// Prevent Multiple Detection
// ==========================================
let applicationDetected = false;

// ==========================================
// Visible Element Check
// ==========================================
const isElementVisible = (
  element
) => {
  if (!element) {
    return false;
  }

  const style =
    window.getComputedStyle(element);

  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0"
  ) {
    return false;
  }

  const rect =
    element.getBoundingClientRect();

  return (
    rect.width > 0 &&
    rect.height > 0
  );
};

// ==========================================
// Find Success Message
// ==========================================
const findVisibleSuccessMessage =
  () => {
    const elements =
      document.querySelectorAll(
        "body *"
      );

    for (
      const element of elements
    ) {
      if (
        !isElementVisible(element)
      ) {
        continue;
      }

      const text = (
        element.innerText ||
        element.textContent ||
        ""
      )
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      if (
        !text ||
        text.length > 300
      ) {
        continue;
      }

      const matchedPattern =
        SUCCESS_PATTERNS.find(
          (pattern) =>
            text.includes(pattern)
        );

      if (matchedPattern) {
        return {
          element,
          matchedPattern,
        };
      }
    }

    return null;
  };

// ==========================================
// Confirmation URL
// ==========================================
const checkSuccessUrl = () => {
  const currentUrl =
    window.location.href
      .toLowerCase();

  return SUCCESS_URL_PATTERNS.find(
    (pattern) =>
      currentUrl.includes(pattern)
  );
};

// ==========================================
// Validate Job Data
// ==========================================
const validateJobData = (
  jobData
) => {
  if (!jobData) {
    return {
      valid: false,
      reason:
        "No job data was extracted.",
    };
  }

  if (!jobData.company) {
    return {
      valid: false,
      reason:
        "Company name could not be identified.",
    };
  }

  if (!jobData.position) {
    return {
      valid: false,
      reason:
        "Job position could not be identified.",
    };
  }

  const companyConfidence =
    Number(
      jobData.confidence
        ?.company || 0
    );

  const positionConfidence =
    Number(
      jobData.confidence
        ?.position || 0
    );

  if (
    positionConfidence < 0.60
  ) {
    return {
      valid: false,
      reason:
        "Job position extraction confidence is too low.",
    };
  }

  if (
    companyConfidence < 0.45
  ) {
    return {
      valid: false,
      reason:
        "Company extraction confidence is too low.",
    };
  }

  return {
    valid: true,
    reason:
      "Job data passed validation.",
  };
};

// ==========================================
// Log Extraction Quality
// ==========================================
const logExtractionQuality = (
  jobData
) => {
  console.log(
    "JobTrack: Extraction Quality",
    {
      detectedSite:
        jobData.detectedSite,

      company:
        jobData.company,

      position:
        jobData.position,

      location:
        jobData.location,

      jobType:
        jobData.jobType,

      confidence:
        jobData.confidence,

      extractionMethod:
        jobData.extractionMethod,

      source:
        jobData.source,
    }
  );
};

// ==========================================
// Send Detected Application
// ==========================================
const sendDetectedApplication = (
  jobData
) => {
  return new Promise(
    (resolve) => {
      chrome.runtime.sendMessage(
        {
          type:
            "APPLICATION_DETECTED",

          data: jobData,
        },
        (response) => {
          if (
            chrome.runtime.lastError
          ) {
            console.error(
              "JobTrack: Background communication failed:",
              chrome.runtime.lastError
                .message
            );

            resolve({
              success: false,
              message:
                chrome.runtime.lastError
                  .message,
            });

            return;
          }

          resolve(
            response || {
              success: false,
              message:
                "No response received.",
            }
          );
        }
      );
    }
  );
};

// ==========================================
// Check Application Status
// ==========================================
const checkApplicationStatus =
  async () => {
    if (
      applicationDetected
    ) {
      return;
    }

    const matchedUrlPattern =
      checkSuccessUrl();

    const successMessage =
      findVisibleSuccessMessage();

    if (
      !matchedUrlPattern &&
      !successMessage
    ) {
      return;
    }

    applicationDetected = true;

    console.log(
      "JobTrack: Application success detected."
    );

    const jobData =
      getJobDetails();

    console.log(
      "JobTrack: Extracted Job Data:",
      jobData
    );

    logExtractionQuality(
      jobData
    );

    const validation =
      validateJobData(
        jobData
      );

    if (
      !validation.valid
    ) {
      console.warn(
        "JobTrack: Application detected, but data was not reliable enough to save.",
        validation.reason
      );

      applicationDetected = false;

      return;
    }

    if (successMessage) {
      console.log(
        "JobTrack: Matched success message:",
        successMessage
          .matchedPattern
      );
    }

    if (matchedUrlPattern) {
      console.log(
        "JobTrack: Matched success URL:",
        matchedUrlPattern
      );
    }

    const response =
      await sendDetectedApplication(
        jobData
      );

    if (
      response.duplicate
    ) {
      console.log(
        "JobTrack: Application already tracked."
      );

      return;
    }

    if (
      response.pending
    ) {
      console.log(
        "JobTrack: Application saved for retry."
      );

      return;
    }

    if (
      response.authError
    ) {
      console.warn(
        "JobTrack: Please login to JobTrack extension."
      );

      return;
    }

    if (
      !response.success
    ) {
      console.error(
        "JobTrack: Application could not be saved:",
        response.message
      );

      return;
    }

    console.log(
      "JobTrack: Application successfully tracked!"
    );
  };

// ==========================================
// Observe Dynamic Changes
// ==========================================
const observer =
  new MutationObserver(
    () => {
      checkApplicationStatus();
    }
  );

if (document.body) {
  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true,
      characterData: true,
    }
  );
}

// ==========================================
// Initial Check
// ==========================================
console.log(
  "JobTrack: Detector is ready."
);

checkApplicationStatus();

// ==========================================
// Retry Detection
// ==========================================
let retryCount = 0;

const MAX_RETRIES = 15;
const RETRY_INTERVAL = 1000;

const retryDetection =
  setInterval(() => {
    if (
      applicationDetected
    ) {
      clearInterval(
        retryDetection
      );

      return;
    }

    checkApplicationStatus();

    retryCount++;

    if (
      retryCount >=
      MAX_RETRIES
    ) {
      clearInterval(
        retryDetection
      );

      console.log(
        "JobTrack: Detection retry window completed."
      );
    }
  }, RETRY_INTERVAL);