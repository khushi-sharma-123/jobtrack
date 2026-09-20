const mongoose = require("mongoose");

const JobApplication = require("../models/JobApplication");
const ApplicationActivity = require("../models/ApplicationActivity");


const {
  generateGoogleCalendarUrl,
} = require("../utils/calendarUtils");
const {
    sendEmail,
  sendInterviewScheduledEmail,
} = require("../services/emailService");

const allowedJobTypes = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
];

const allowedStatuses = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Selected",
];

// ==========================================
// Helper: Add Timeline Activity
// ==========================================
const addActivity = async (data) => {
  try {
    await ApplicationActivity.create(data);
  } catch (error) {
    console.error("Activity creation failed:", error.message);
  }
};

// ==========================================
// Helper: Validate Tags
// ==========================================
const validateTags = (tags) => {
  if (tags === undefined) {
    return null;
  }

  if (!Array.isArray(tags)) {
    return "Tags must be an array";
  }

  if (tags.length > 10) {
    return "Maximum 10 tags are allowed";
  }

  for (const tag of tags) {
    if (typeof tag !== "string") {
      return "Each tag must be a string";
    }

    if (tag.trim().length === 0) {
      return "Tags cannot be empty";
    }

    if (tag.trim().length > 30) {
      return "Each tag must be 30 characters or less";
    }
  }

  return null;
};


const normalizeJobUrl = (url) => {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url.trim());

    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
      "dclid",
      "msclkid",
      "ref",
      "referrer",
    ];

    trackingParams.forEach((param) => {
      parsedUrl.searchParams.delete(param);
    });

    // Remove trailing slash from pathname
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, "");

    return parsedUrl.toString();
  } catch (error) {
    return url.trim();
  }
};

// ==========================================
// Create Application
// ==========================================
const createApplication = async (req, res) => {
  try {
    const {
      company,
      position,
      location,
      jobType,
      status,
      appliedDate,
      followUpDate,
      followUpCompleted,
      jobUrl,
      notes,
      tags,
      recruiterName,
      recruiterEmail,
      recruiterPhone,
      recruiterLinkedin,
      interviewNotes,
       
      // Interview details
  interviewDate,
  interviewDuration,
  interviewType,
  interviewLocation,
    } = req.body;

    if (!company || !position) {
      return res.status(400).json({
        message: "Company and position are required",
      });
    }

    if (jobType && !allowedJobTypes.includes(jobType)) {
      return res.status(400).json({
        message: "Invalid job type",
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    const tagError = validateTags(tags);

    if (tagError) {
      return res.status(400).json({
        message: tagError,
      });
    }

// ==========================================
// Normalize Job URL
// ==========================================
const normalizedJobUrl = normalizeJobUrl(jobUrl);


// ==========================================
// Prevent Duplicate Applications
// ==========================================
if (normalizedJobUrl) {
  const existingApplication = await JobApplication.findOne({
    user: req.user.userId,
    jobUrl: normalizedJobUrl,
  });

  if (existingApplication) {
    return res.status(409).json({
      message: "This job application is already tracked",
      application: existingApplication,
    });
  }
}

// ==========================================
// Fallback Duplicate Check
// Used when job URL is not available
// ==========================================
if (!normalizedJobUrl) {
  const existingApplication = await JobApplication.findOne({
    user: req.user.userId,
    company: { $regex: `^${company.trim()}$`, $options: "i" },
    position: { $regex: `^${position.trim()}$`, $options: "i" },
    location: {
      $regex: `^${(location || "").trim()}$`,
      $options: "i",
    },
  });

  if (existingApplication) {
    return res.status(409).json({
      message: "A similar job application is already tracked",
      application: existingApplication,
    });
  }
}

    const application = await JobApplication.create({
      user: req.user.userId,
      company,
      position,
      location,
      jobType,
      status,
      appliedDate,
      followUpDate,
      followUpCompleted,
    jobUrl: normalizedJobUrl,
      notes,
      tags: tags
        ? [...new Set(tags.map((tag) => tag.trim()))]
        : [],
      recruiterName,
      recruiterEmail,
      recruiterPhone,
      recruiterLinkedin,
      interviewNotes,
interviewDate,
interviewDuration,
interviewType,
interviewLocation,
    });

    await addActivity({
      application: application._id,
      user: req.user.userId,
      type: "created",
      message: `Application created for ${application.company}`,
    });

    // ==========================================
// Send Interview Scheduled Email
// ==========================================
if (status === "Interview" && interviewDate) {
  try {
    const User = require("../models/User");

    const user = await User.findById(req.user.userId);

    if (user && user.email) {
      await sendInterviewScheduledEmail({
        to: user.email,
        userName: user.name,
        company: application.company,
        position: application.position,
        interviewDate: application.interviewDate,
        interviewType: application.interviewType,
        interviewLocation: application.interviewLocation,
      });

      console.log(
        "Interview scheduled email sent successfully"
      );
    }
  } catch (emailError) {
    console.error(
      "Interview email failed:",
      emailError.message
    );
  }
}

    res.status(201).json({
      message: "Application added successfully",
      application,
    });
  } catch (error) {
    console.error("Create application error:", error);

    res.status(500).json({
      message: "Failed to add application",
    });
  }
};

// ==========================================
// Get Applications
// ==========================================
const getApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);

    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

// ==========================================
// Search + Filters
// ==========================================
const searchApplications = async (req, res) => {
  try {
    const {
      search,
      status,
      jobType,
      location,
      tag,
    } = req.query;

    const filter = {
      user: req.user.userId,
    };

    if (search && search.trim()) {
      filter.$or = [
        {
          company: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          position: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid application status",
        });
      }

      filter.status = status;
    }

    if (jobType) {
      if (!allowedJobTypes.includes(jobType)) {
        return res.status(400).json({
          message: "Invalid job type",
        });
      }

      filter.jobType = jobType;
    }

    if (location && location.trim()) {
      filter.location = {
        $regex: location.trim(),
        $options: "i",
      };
    }

    if (tag && tag.trim()) {
      filter.tags = {
        $in: [tag.trim()],
      };
    }

    const applications = await JobApplication.find(filter).sort({
      createdAt: -1,
    });

    res.json(applications);
  } catch (error) {
    console.error("Search applications error:", error);

    res.status(500).json({
      message: "Failed to search applications",
    });
  }
};

// ==========================================
// Application Statistics / Analytics
// ==========================================
const getApplicationStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await JobApplication.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const result = {
      total: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      Selected: 0,
      responseRate: 0,
      interviewRate: 0,
      offerRate: 0,
      selectionRate: 0,
    };

    stats.forEach((item) => {
      result[item._id] = item.count;
      result.total += item.count;
    });

    if (result.total > 0) {
      result.responseRate = Number(
        (
          ((result.total - result.Applied) / result.total) *
          100
        ).toFixed(1)
      );

      result.interviewRate = Number(
        (
          ((result.Interview +
            result.Offer +
            result.Selected) /
            result.total) *
          100
        ).toFixed(1)
      );

      result.offerRate = Number(
        (
          ((result.Offer + result.Selected) /
            result.total) *
          100
        ).toFixed(1)
      );

      result.selectionRate = Number(
        (
          (result.Selected / result.total) *
          100
        ).toFixed(1)
      );
    }

    res.json(result);
  } catch (error) {
    console.error("Get application stats error:", error);

    res.status(500).json({
      message: "Failed to fetch application statistics",
    });
  }
};

// ==========================================
// Get Application By ID
// ==========================================
const getApplicationById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const application = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json(application);
  } catch (error) {
    console.error("Get application error:", error);

    res.status(500).json({
      message: "Failed to fetch application",
    });
  }
};


// ==========================================
// Update Application
// ==========================================
const updateApplication = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const {
      company,
      position,
      location,
      jobType,
      status,
      appliedDate,
      followUpDate,
      followUpCompleted,
      jobUrl,
      notes,
      tags,
      recruiterName,
      recruiterEmail,
      recruiterPhone,
      recruiterLinkedin,
      interviewNotes,
    } = req.body;

    if (!company || !position) {
      return res.status(400).json({
        message: "Company and position are required",
      });
    }

    if (jobType && !allowedJobTypes.includes(jobType)) {
      return res.status(400).json({
        message: "Invalid job type",
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    const tagError = validateTags(tags);

    if (tagError) {
      return res.status(400).json({
        message: tagError,
      });
    }

    const existingApplication =
      await JobApplication.findOne({
        _id: req.params.id,
        user: req.user.userId,
      });

    if (!existingApplication) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // ==========================================
    // Detect Actual Changes
    // ==========================================

    const changes = [];

    const oldStatus = existingApplication.status;

    if (existingApplication.company !== company) {
      changes.push("Company updated");
    }

    if (existingApplication.position !== position) {
      changes.push("Position updated");
    }

    if (
      (existingApplication.location || "") !==
      (location || "")
    ) {
      changes.push("Location updated");
    }

    if (
      (existingApplication.jobType || "") !==
      (jobType || "")
    ) {
      changes.push("Job type updated");
    }

    if (
      (existingApplication.status || "") !==
      (status || "")
    ) {
      changes.push(
        `Status changed from ${oldStatus} to ${status}`
      );
    }

    if (
      String(existingApplication.appliedDate || "") !==
      String(appliedDate || "")
    ) {
      changes.push("Applied date updated");
    }

    if (
      String(existingApplication.followUpDate || "") !==
      String(followUpDate || "")
    ) {
      changes.push("Follow-up date updated");
    }

    if (
      existingApplication.followUpCompleted !==
      (followUpCompleted ??
        existingApplication.followUpCompleted)
    ) {
      changes.push("Follow-up status updated");
    }

    if (
      (existingApplication.jobUrl || "") !==
      (jobUrl || "")
    ) {
      changes.push("Job URL updated");
    }

    if (
      (existingApplication.notes || "") !==
      (notes || "")
    ) {
      changes.push("Notes updated");
    }

    if (tags !== undefined) {
      const oldTags = [
        ...(existingApplication.tags || []),
      ].sort();

      const newTags = [
        ...new Set(tags.map((tag) => tag.trim())),
      ].sort();

      if (
        JSON.stringify(oldTags) !==
        JSON.stringify(newTags)
      ) {
        changes.push("Tags updated");
      }
    }

    const oldRecruiterInfo = [
      existingApplication.recruiterName || "",
      existingApplication.recruiterEmail || "",
      existingApplication.recruiterPhone || "",
      existingApplication.recruiterLinkedin || "",
    ].join("|");

    const newRecruiterInfo = [
      recruiterName ?? "",
      recruiterEmail ?? "",
      recruiterPhone ?? "",
      recruiterLinkedin ?? "",
    ].join("|");

    if (oldRecruiterInfo !== newRecruiterInfo) {
      changes.push("Recruiter information updated");
    }

    if (
      (existingApplication.interviewNotes || "") !==
      (interviewNotes || "")
    ) {
      changes.push("Interview notes updated");
    }

    // ==========================================
    // Update Application
    // ==========================================

    existingApplication.company = company;
    existingApplication.position = position;
    existingApplication.location = location;
    existingApplication.jobType = jobType;
    existingApplication.status = status;
    existingApplication.appliedDate = appliedDate;
    existingApplication.followUpDate = followUpDate;

    existingApplication.followUpCompleted =
      followUpCompleted ??
      existingApplication.followUpCompleted;

    existingApplication.jobUrl = jobUrl;
    existingApplication.notes = notes;

    if (tags !== undefined) {
      existingApplication.tags = [
        ...new Set(tags.map((tag) => tag.trim())),
      ];
    }

    existingApplication.recruiterName =
      recruiterName ?? "";

    existingApplication.recruiterEmail =
      recruiterEmail ?? "";

    existingApplication.recruiterPhone =
      recruiterPhone ?? "";

    existingApplication.recruiterLinkedin =
      recruiterLinkedin ?? "";

    existingApplication.interviewNotes =
      interviewNotes ?? "";

    const application =
      await existingApplication.save();

    // ==========================================
    // Add Timeline Activity Only If Changed
    // ==========================================

    if (changes.length > 0) {
      await addActivity({
        application: application._id,
        user: req.user.userId,
        type:
          status && status !== oldStatus
            ? "status_changed"
            : "updated",
        message: changes.join(" • "),
        oldStatus:
          status && status !== oldStatus
            ? oldStatus
            : "",
        newStatus:
          status && status !== oldStatus
            ? status
            : "",
      });
    }

    res.json({
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    console.error(
      "Update application error:",
      error
    );

    res.status(500).json({
      message: "Failed to update application",
    });
  }
};


// ==========================================
// Update Status
// ==========================================
const updateApplicationStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const { status } = req.body;

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    const application =
      await JobApplication.findOne({
        _id: req.params.id,
        user: req.user.userId,
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const oldStatus = application.status;

    if (oldStatus === status) {
      return res.json({
        message: "Status is already set",
        application,
      });
    }

    application.status = status;

    await application.save();

    await addActivity({
      application: application._id,
      user: req.user.userId,
      type: "status_changed",
      message: `Status changed from ${oldStatus} to ${status}`,
      oldStatus,
      newStatus: status,
    });

    res.json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error(
      "Update application status error:",
      error
    );

    res.status(500).json({
      message: "Failed to update application status",
    });
  }
};

// ==========================================
// Update Tags
// ==========================================
const updateApplicationTags = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const { tags } = req.body;

    const tagError = validateTags(tags);

    if (tagError) {
      return res.status(400).json({
        message: tagError,
      });
    }

    const cleanedTags = [
      ...new Set(tags.map((tag) => tag.trim())),
    ];

    const application =
      await JobApplication.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.userId,
        },
        {
          tags: cleanedTags,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    await addActivity({
      application: application._id,
      user: req.user.userId,
      type: "tag_added",
      message: "Application tags updated",
    });

    res.json({
      message: "Application tags updated successfully",
      application,
    });
  } catch (error) {
    console.error(
      "Update application tags error:",
      error
    );

    res.status(500).json({
      message: "Failed to update application tags",
    });
  }
};

// ==========================================
// Update Follow-Up
// ==========================================
const updateFollowUp = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const {
      followUpDate,
      followUpCompleted,
    } = req.body;

    const application =
      await JobApplication.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.userId,
        },
        {
          followUpDate,
          followUpCompleted:
            followUpCompleted ?? false,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    await addActivity({
      application: application._id,
      user: req.user.userId,
      type: "follow_up_completed",
      message: followUpCompleted
        ? "Follow-up marked as completed"
        : "Follow-up updated",
    });

    res.json({
      message: "Follow-up updated successfully",
      application,
    });
  } catch (error) {
    console.error(
      "Update follow-up error:",
      error
    );

    res.status(500).json({
      message: "Failed to update follow-up",
    });
  }
};

// ==========================================
// Update Interview / Recruiter Information
// ==========================================
const updateInterviewInfo = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const {
      recruiterName,
      recruiterEmail,
      recruiterPhone,
      recruiterLinkedin,
      interviewNotes,
      interviewDate,
      interviewDuration,
      interviewType,
      interviewLocation,
    } = req.body;

    // ==========================================
    // Validation
    // ==========================================

    const allowedInterviewTypes = [
      "Online",
      "Offline",
      "Phone",
    ];

    if (
      interviewType !== undefined &&
      !allowedInterviewTypes.includes(interviewType)
    ) {
      return res.status(400).json({
        message: "Invalid interview type",
      });
    }

    if (interviewDate !== undefined && interviewDate !== null) {
      const parsedDate = new Date(interviewDate);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          message: "Invalid interview date",
        });
      }

      if (parsedDate <= new Date()) {
        return res.status(400).json({
          message: "Interview date must be in the future",
        });
      }
    }

    if (interviewDuration !== undefined) {
      const duration = Number(interviewDuration);

      if (Number.isNaN(duration) || duration < 15) {
        return res.status(400).json({
          message:
            "Interview duration must be at least 15 minutes",
        });
      }
    }

    // ==========================================
    // Find Application
    // ==========================================

    const application =
      await JobApplication.findOne({
        _id: req.params.id,
        user: req.user.userId,
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // ==========================================
    // Detect Changes
    // ==========================================

    const changes = [];

    if (
      recruiterName !== undefined &&
      application.recruiterName !== recruiterName
    ) {
      changes.push("Recruiter name updated");
    }

    if (
      recruiterEmail !== undefined &&
      application.recruiterEmail !== recruiterEmail
    ) {
      changes.push("Recruiter email updated");
    }

    if (
      recruiterPhone !== undefined &&
      application.recruiterPhone !== recruiterPhone
    ) {
      changes.push("Recruiter phone updated");
    }

    if (
      recruiterLinkedin !== undefined &&
      application.recruiterLinkedin !== recruiterLinkedin
    ) {
      changes.push("Recruiter LinkedIn updated");
    }

    if (
      interviewNotes !== undefined &&
      application.interviewNotes !== interviewNotes
    ) {
      changes.push("Interview notes updated");
    }

    if (
      interviewDate !== undefined &&
      String(application.interviewDate || "") !==
        String(interviewDate || "")
    ) {
      changes.push("Interview date updated");
    }

    if (
      interviewDuration !== undefined &&
      application.interviewDuration !==
        Number(interviewDuration)
    ) {
      changes.push("Interview duration updated");
    }

    if (
      interviewType !== undefined &&
      application.interviewType !== interviewType
    ) {
      changes.push("Interview type updated");
    }

    if (
      interviewLocation !== undefined &&
      application.interviewLocation !== interviewLocation
    ) {
      changes.push("Interview location updated");
    }

    // ==========================================
    // Update Recruiter Information
    // ==========================================

    if (recruiterName !== undefined) {
      application.recruiterName = recruiterName;
    }

    if (recruiterEmail !== undefined) {
      application.recruiterEmail = recruiterEmail;
    }

    if (recruiterPhone !== undefined) {
      application.recruiterPhone = recruiterPhone;
    }

    if (recruiterLinkedin !== undefined) {
      application.recruiterLinkedin = recruiterLinkedin;
    }

    if (interviewNotes !== undefined) {
      application.interviewNotes = interviewNotes;
    }

    // ==========================================
    // Update Interview Information
    // ==========================================

    let interviewWasScheduled = false;

    if (interviewDate !== undefined) {
      application.interviewDate =
        interviewDate || null;

      application.interviewReminderSent = false;

      application.calendarEventId = null;

      if (interviewDate) {
        interviewWasScheduled = true;
      }
    }

    if (interviewDuration !== undefined) {
      application.interviewDuration =
        Number(interviewDuration);

      application.calendarEventId = null;
    }

    if (interviewType !== undefined) {
      application.interviewType = interviewType;

      application.calendarEventId = null;
    }

    if (interviewLocation !== undefined) {
      application.interviewLocation =
        interviewLocation;

      application.calendarEventId = null;
    }

    // ==========================================
    // Save Application
    // ==========================================

    const updatedApplication =
      await application.save();

    // ==========================================
    // Timeline Activity
    // ==========================================

    if (changes.length > 0) {
      await addActivity({
        application: updatedApplication._id,
        user: req.user.userId,
        type: "note_added",
        message: changes.join(" • "),
      });
    }

    // ==========================================
    // Send Interview Email
    // ==========================================

    if (interviewWasScheduled) {
      try {
        const User = require("../models/User");

        const user = await User.findById(
          req.user.userId
        );

        if (user && user.email) {
          await sendInterviewScheduledEmail({
            to: user.email,
            userName: user.name,
            company: updatedApplication.company,
            position: updatedApplication.position,
            interviewDate:
              updatedApplication.interviewDate,
            interviewType:
              updatedApplication.interviewType,
            interviewLocation:
              updatedApplication.interviewLocation,
          });

          console.log(
            "Interview scheduled email sent successfully"
          );
        }
      } catch (emailError) {
        console.error(
          "Interview email failed:",
          emailError.message
        );
      }
    }

    // ==========================================
    // Response
    // ==========================================

    res.json({
      message:
        "Interview information updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(
      "Update interview information error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update interview information",
    });
  }
};
// ==========================================
// Get Application Timeline
// ==========================================
const getApplicationTimeline = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const application =
      await JobApplication.findOne({
        _id: req.params.id,
        user: req.user.userId,
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const timeline =
      await ApplicationActivity.find({
        application: application._id,
        user: req.user.userId,
      }).sort({ createdAt: -1 });

    res.json(timeline);
  } catch (error) {
    console.error(
      "Get application timeline error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch application timeline",
    });
  }
};

// ==========================================
// Export Applications as CSV
// ==========================================
const exportApplicationsCSV = async (req, res) => {
  try {
    const applications =
      await JobApplication.find({
        user: req.user.userId,
      }).sort({ createdAt: -1 });

    const headers = [
      "Company",
      "Position",
      "Location",
      "Job Type",
      "Status",
      "Applied Date",
      "Follow-up Date",
      "Follow-up Completed",
      "Job URL",
      "Tags",
      "Recruiter Name",
      "Recruiter Email",
      "Recruiter Phone",
      "Recruiter LinkedIn",
      "Interview Notes",
      "Notes",
    ];

    const escapeCSV = (value) => {
      if (
        value === null ||
        value === undefined
      ) {
        return "";
      }

      const stringValue = String(value);

      return `"${stringValue.replace(
        /"/g,
        '""'
      )}"`;
    };

    const rows = applications.map((app) => [
      app.company,
      app.position,
      app.location,
      app.jobType,
      app.status,
      app.appliedDate
        ? new Date(app.appliedDate).toISOString()
        : "",
      app.followUpDate
        ? new Date(app.followUpDate).toISOString()
        : "",
      app.followUpCompleted ? "Yes" : "No",
      app.jobUrl,
      (app.tags || []).join(", "),
      app.recruiterName,
      app.recruiterEmail,
      app.recruiterPhone,
      app.recruiterLinkedin,
      app.interviewNotes,
      app.notes,
    ]);

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        row.map(escapeCSV).join(",")
      ),
    ].join("\n");

    res.setHeader(
      "Content-Type",
      "text/csv; charset=utf-8"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="jobtrack-applications.csv"'
    );

    res.send(csv);
  } catch (error) {
    console.error(
      "Export applications error:",
      error
    );

    res.status(500).json({
      message: "Failed to export applications",
    });
  }
};

// ==========================================
// Delete Application
// ==========================================
const deleteApplication = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const application =
      await JobApplication.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId,
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    await ApplicationActivity.deleteMany({
      application: application._id,
      user: req.user.userId,
    });

    res.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);

    res.status(500).json({
      message: "Failed to delete application",
    });
  }
};

const generateCalendarEvent = async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (!application.interviewDate) {
      return res.status(400).json({
        message: "Interview date is not available",
      });
    }

    const calendarUrl = generateGoogleCalendarUrl({
      company: application.company,
      position: application.position,
      interviewDate: application.interviewDate,
      interviewDuration: application.interviewDuration,
      interviewType: application.interviewType,
      interviewLocation: application.interviewLocation,
      interviewNotes: application.interviewNotes,
    });

    res.status(200).json({
      message: "Calendar event generated successfully",
      calendarUrl,
    });
  } catch (error) {
    console.error("Calendar event error:", error);

    res.status(500).json({
      message: "Failed to generate calendar event",
    });
  }
};
// ==========================================
// Send Follow-Up Email
// ==========================================
const sendFollowUpEmail = async (req, res) => {
  try {
    const {
      applicationId,
      to,
      subject,
      message,
    } = req.body;

    // ==========================================
    // Validation
    // ==========================================

    if (!applicationId) {
      return res.status(400).json({
        message: "Application ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const recipientEmail = (to || "").trim();

    if (!recipientEmail) {
      return res.status(400).json({
        message: "Recipient email is required",
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({
        message: "Invalid recipient email",
      });
    }

    const cleanSubject = (subject || "").trim();
    const cleanMessage = (message || "").trim();

    if (!cleanSubject) {
      return res.status(400).json({
        message: "Email subject is required",
      });
    }

    if (!cleanMessage) {
      return res.status(400).json({
        message: "Email message is required",
      });
    }

    // ==========================================
    // Find application belonging to current user
    // ==========================================

    const application = await JobApplication.findOne({
      _id: applicationId,
      user: req.user.userId,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // ==========================================
    // Escape HTML
    // ==========================================

    const safeMessage = cleanMessage
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\r\n/g, "\n")
      .replace(/\n/g, "<br />");

    const html = `
      <div
        style="
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 650px;
          margin: auto;
        "
      >
        ${safeMessage}

        <br />
        <br />

        <hr
          style="
            border: 0;
            border-top: 1px solid #e5e7eb;
          "
        />

        <p
          style="
            color: #777;
            font-size: 12px;
          "
        >
          Sent using JobTrack
        </p>
      </div>
    `;

    // ==========================================
    // Send Email
    // ==========================================

    const emailInfo = await sendEmail({
      to: recipientEmail,
      subject: cleanSubject,
      html,
    });

    // ==========================================
    // Save recruiter email for future use
    // ==========================================

    application.recruiterEmail = recipientEmail;

    await application.save();

    // ==========================================
    // Add Timeline Activity
    // ==========================================

    await addActivity({
      application: application._id,
      user: req.user.userId,
      type: "note_added",
      message: `Follow-up email sent to ${recipientEmail}`,
    });

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      message: "Email sent successfully",
      messageId: emailInfo.messageId,
      application,
    });

  } catch (error) {
    console.error(
      "Send follow-up email error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to send follow-up email",
    });
  }
};

module.exports = {
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
     sendFollowUpEmail,
};