// ==========================================
// JobTrack Background Service Worker
// ==========================================

console.log(
  "JobTrack background service started"
);

const API_URL =
  "http://localhost:5000/api";

// ==========================================
// Retry Configuration
// ==========================================
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const PENDING_ALARM_NAME =
  "jobtrack-pending-retry";

const PENDING_RETRY_INTERVAL =
  5;

// ==========================================
// Wait Helper
// ==========================================
const wait = (
  milliseconds
) => {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds
      );
    }
  );
};

// ==========================================
// Retryable Status
// ==========================================
const isRetryableStatus =
  (status) => {
    if (status >= 500) {
      return true;
    }

    if (
      status === 408 ||
      status === 429
    ) {
      return true;
    }

    return false;
  };

// ==========================================
// Send Application to Backend
// ==========================================
const sendApplicationToBackend =
  async (
    applicationData,
    token
  ) => {
    let lastError = null;

    for (
      let attempt = 1;
      attempt <= MAX_RETRIES;
      attempt++
    ) {
      try {
        console.log(
          `JobTrack: Sending application (attempt ${attempt}/${MAX_RETRIES})`
        );

        const response =
          await fetch(
            `${API_URL}/applications`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify(
                  applicationData
                ),
            }
          );

        let data = {};

        try {
          data =
            await response.json();
        } catch (error) {
          data = {};
        }

        // ==========================================
        // Success
        // ==========================================
        if (
          response.ok
        ) {
          return {
            success: true,
            data,
          };
        }

        // ==========================================
        // Duplicate
        // ==========================================
        if (
          response.status ===
          409
        ) {
          return {
            success: false,
            duplicate: true,

            message:
              data.message ||
              "This job is already tracked.",

            data,
          };
        }

        // ==========================================
        // Authentication Error
        // ==========================================
        if (
          response.status ===
            401 ||
          response.status ===
            403
        ) {
          return {
            success: false,
            authError: true,

            message:
              data.message ||
              "Your session has expired. Please login again.",
          };
        }

        // ==========================================
        // Retry Server Errors
        // ==========================================
        if (
          isRetryableStatus(
            response.status
          ) &&
          attempt <
            MAX_RETRIES
        ) {
          await wait(
            RETRY_DELAY
          );

          continue;
        }

        return {
          success: false,

          message:
            data.message ||
            `Server returned status ${response.status}.`,
        };
      } catch (error) {
        lastError = error;

        console.error(
          `JobTrack: Network error on attempt ${attempt}:`,
          error
        );

        if (
          attempt <
          MAX_RETRIES
        ) {
          await wait(
            RETRY_DELAY
          );
        }
      }
    }

    return {
      success: false,

      networkError: true,

      message:
        lastError?.message ||
        "Unable to connect to JobTrack server.",
    };
  };

// ==========================================
// Save Pending Application
// ==========================================
const savePendingApplication =
  async (
    applicationData
  ) => {
    try {
      const result =
        await chrome.storage.local.get(
          [
            "pendingApplications",
          ]
        );

      const pendingApplications =
        result.pendingApplications ||
        [];

      const alreadyPending =
        pendingApplications.some(
          (application) =>
            application.jobUrl ===
            applicationData.jobUrl
        );

      if (
        alreadyPending
      ) {
        return;
      }

      pendingApplications.push(
        {
          ...applicationData,

          pendingSince:
            new Date()
              .toISOString(),

          retryCount: 0,
        }
      );

      await chrome.storage.local.set(
        {
          pendingApplications,
        }
      );

      console.log(
        "JobTrack: Application added to pending queue."
      );
    } catch (error) {
      console.error(
        "JobTrack: Failed to save pending application:",
        error
      );
    }
  };

// ==========================================
// Remove Pending Application
// ==========================================
const removePendingApplication =
  async (
    jobUrl
  ) => {
    const result =
      await chrome.storage.local.get(
        [
          "pendingApplications",
        ]
      );

    const pendingApplications =
      result.pendingApplications ||
      [];

    const updated =
      pendingApplications.filter(
        (application) =>
          application.jobUrl !==
          jobUrl
      );

    await chrome.storage.local.set(
      {
        pendingApplications:
          updated,
      }
    );
  };

// ==========================================
// Update Pending Retry
// ==========================================
const updatePendingRetry =
  async (
    jobUrl,
    errorMessage
  ) => {
    const result =
      await chrome.storage.local.get(
        [
          "pendingApplications",
        ]
      );

    const pendingApplications =
      result.pendingApplications ||
      [];

    const updated =
      pendingApplications.map(
        (application) => {
          if (
            application.jobUrl ===
            jobUrl
          ) {
            return {
              ...application,

              retryCount:
                (application.retryCount ||
                  0) + 1,

              lastRetryAt:
                new Date()
                  .toISOString(),

              lastError:
                errorMessage || "",
            };
          }

          return application;
        }
      );

    await chrome.storage.local.set(
      {
        pendingApplications:
          updated,
      }
    );
  };

// ==========================================
// Remember Tracked Application
// ==========================================
const rememberTrackedApplication =
  async (
    jobUrl
  ) => {
    if (!jobUrl) {
      return;
    }

    const result =
      await chrome.storage.local.get(
        [
          "trackedApplications",
        ]
      );

    const trackedApplications =
      result.trackedApplications ||
      [];

    if (
      trackedApplications.includes(
        jobUrl
      )
    ) {
      return;
    }

    await chrome.storage.local.set(
      {
        trackedApplications: [
          ...trackedApplications,
          jobUrl,
        ],
      }
    );
  };

// ==========================================
// Save Last Application
// ==========================================
const saveLastApplication =
  async (
    applicationData
  ) => {
    await chrome.storage.local.set(
      {
        lastApplication:
          applicationData,
      }
    );
  };

// ==========================================
// Retry Pending Applications
// ==========================================
const retryPendingApplications =
  async () => {
    try {
      const result =
        await chrome.storage.local.get(
          [
            "token",
            "pendingApplications",
          ]
        );

      const token =
        result.token;

      const pendingApplications =
        result.pendingApplications ||
        [];

      if (
        pendingApplications.length ===
        0
      ) {
        return;
      }

      if (!token) {
        console.log(
          "JobTrack: Login required before retrying pending applications."
        );

        return;
      }

      console.log(
        `JobTrack: Retrying ${pendingApplications.length} pending application(s).`
      );

      for (
        const application of
          pendingApplications
      ) {
        const resultFromBackend =
          await sendApplicationToBackend(
            application,
            token
          );

        // ==========================================
        // Success
        // ==========================================
        if (
          resultFromBackend.success
        ) {
          await rememberTrackedApplication(
            application.jobUrl
          );

          await removePendingApplication(
            application.jobUrl
          );

          await saveLastApplication(
            application
          );

          console.log(
            "JobTrack: Pending application successfully saved."
          );

          continue;
        }

        // ==========================================
        // Duplicate
        // ==========================================
        if (
          resultFromBackend.duplicate
        ) {
          await rememberTrackedApplication(
            application.jobUrl
          );

          await removePendingApplication(
            application.jobUrl
          );

          console.log(
            "JobTrack: Pending application already existed."
          );

          continue;
        }

        // ==========================================
        // Authentication Error
        // ==========================================
        if (
          resultFromBackend.authError
        ) {
          console.warn(
            "JobTrack: Authentication expired. Stopping pending retry."
          );

          return;
        }

        // ==========================================
        // Failure
        // ==========================================
        await updatePendingRetry(
          application.jobUrl,
          resultFromBackend.message
        );

        await wait(1000);
      }
    } catch (error) {
      console.error(
        "JobTrack: Pending retry failed:",
        error
      );
    }
  };

// ==========================================
// Handle New Application
// ==========================================
const handleApplicationDetected =
  async (
    message,
    sendResponse
  ) => {
    try {
      const result =
        await chrome.storage.local.get(
          [
            "token",
            "trackedApplications",
          ]
        );

      if (!result.token) {
        sendResponse({
          success: false,
          authError: true,

          message:
            "User is not logged in.",
        });

        return;
      }

      const jobUrl =
        message.data?.jobUrl ||
        "";

      const trackedApplications =
        result.trackedApplications ||
        [];

      const alreadyTracked =
        trackedApplications.some(
          (url) =>
            url === jobUrl
        );

      if (
        alreadyTracked
      ) {
        sendResponse({
          success: false,
          duplicate: true,

          message:
            "This job is already tracked.",
        });

        return;
      }

      // ==========================================
      // Prepare Data
      // ==========================================
      const applicationData = {
        company:
          message.data.company,

        position:
          message.data.position,

        location:
          message.data.location ||
          "",

        jobUrl,

        appliedDate:
          message.data.appliedDate ||
          new Date().toISOString(),

        status:
          "Applied",

        jobType:
          message.data.jobType ||
          "Full-time",

        notes:
          `Automatically detected from ${message.data.source}`,

        confidence:
          message.data.confidence ||
          {},

        extractionMethod:
          message.data
            .extractionMethod ||
          {},

        source:
          message.data.source ||
          "",
      };

      const resultFromBackend =
        await sendApplicationToBackend(
          applicationData,
          result.token
        );

      // ==========================================
      // Auth Error
      // ==========================================
      if (
        resultFromBackend.authError
      ) {
        sendResponse({
          success: false,
          authError: true,

          message:
            resultFromBackend.message,
        });

        return;
      }

      // ==========================================
      // Duplicate
      // ==========================================
      if (
        resultFromBackend.duplicate
      ) {
        await rememberTrackedApplication(
          jobUrl
        );

        sendResponse({
          success: false,
          duplicate: true,

          message:
            resultFromBackend.message,
        });

        return;
      }

      // ==========================================
      // Network Error
      // ==========================================
      if (
        resultFromBackend.networkError
      ) {
        await savePendingApplication(
          applicationData
        );

        sendResponse({
          success: false,
          pending: true,

          message:
            "Application detected but server is unavailable. Saved for retry.",
        });

        return;
      }

      // ==========================================
      // Other Error
      // ==========================================
      if (
        !resultFromBackend.success
      ) {
        sendResponse({
          success: false,

          message:
            resultFromBackend.message ||
            "Failed to save application.",
        });

        return;
      }

      // ==========================================
      // Success
      // ==========================================
      await rememberTrackedApplication(
        jobUrl
      );

      await saveLastApplication(
        message.data
      );

      // ==========================================
      // Retry Older Applications
      // ==========================================
      await retryPendingApplications();

      sendResponse({
        success: true,

        data:
          resultFromBackend.data,
      });
    } catch (error) {
      console.error(
        "JobTrack: Unexpected error:",
        error
      );

      try {
        if (
          message?.data
        ) {
          await savePendingApplication(
            message.data
          );
        }
      } catch (
        pendingError
      ) {
        console.error(
          "JobTrack: Pending save failed:",
          pendingError
        );
      }

      sendResponse({
        success: false,
        pending: true,

        message:
          error.message ||
          "Unexpected error occurred.",
      });
    }
  };

// ==========================================
// Message Listener
// ==========================================
chrome.runtime.onMessage.addListener(
  (
    message,
    sender,
    sendResponse
  ) => {
    if (
      message.type !==
      "APPLICATION_DETECTED"
    ) {
      return;
    }

    handleApplicationDetected(
      message,
      sendResponse
    );

    return true;
  }
);

// ==========================================
// Create Automatic Retry Alarm
// ==========================================
chrome.alarms.create(
  PENDING_ALARM_NAME,
  {
    periodInMinutes:
      PENDING_RETRY_INTERVAL,
  }
);

// ==========================================
// Listen for Alarm
// ==========================================
chrome.alarms.onAlarm.addListener(
  (alarm) => {
    if (
      alarm.name !==
      PENDING_ALARM_NAME
    ) {
      return;
    }

    console.log(
      "JobTrack: Pending retry alarm triggered."
    );

    retryPendingApplications();
  }
);

// ==========================================
// Extension Startup
// ==========================================
chrome.runtime.onStartup.addListener(
  () => {
    console.log(
      "JobTrack: Browser startup detected."
    );

    retryPendingApplications();
  }
);

// ==========================================
// Service Worker Start
// ==========================================
retryPendingApplications();