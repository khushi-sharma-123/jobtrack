// ==========================================
// JobTrack LinkedIn Extractor
// ==========================================

const extractLinkedInJobData = () => {
  const clean = (value) => {
    if (!value) return "";

    return String(value)
      .replace(/\s+/g, " ")
      .trim();
  };

  const firstText = (selectors) => {
    for (const selector of selectors) {
      try {
        const element =
          document.querySelector(selector);

        if (!element) continue;

        const text = clean(
          element.innerText ||
          element.textContent
        );

        if (text) {
          return text;
        }
      } catch (error) {
        // Ignore invalid selectors
      }
    }

    return "";
  };

  // ==========================================
  // Position
  // ==========================================
  const position = firstText([
    ".job-details-jobs-unified-top-card__job-title",
    ".jobs-unified-top-card__job-title",
    ".jobs-unified-top-card__job-title-link",
    "h1",
  ]);

  // ==========================================
  // Company
  // ==========================================
  const company = firstText([
    ".job-details-jobs-unified-top-card__company-name",
    ".jobs-unified-top-card__company-name",
    ".jobs-unified-top-card__company-name a",
    "[class*='company-name']",
  ]);

  // ==========================================
  // Location
  // ==========================================
  const location = firstText([
    ".job-details-jobs-unified-top-card__bullet",
    ".jobs-unified-top-card__bullet",
    ".jobs-unified-top-card__primary-description",
    "[class*='job-location']",
  ]);

  // ==========================================
  // Description
  // ==========================================
  const description = firstText([
    ".jobs-description__content",
    ".jobs-box__html-content",
    ".jobs-description-content__text",
    "[class*='jobs-description']",
  ]);

  // ==========================================
  // Job Type
  // ==========================================
  const pageText =
    clean(document.body?.innerText)
      .toLowerCase();

  let jobType = "";

  if (
    pageText.includes("internship")
  ) {
    jobType = "Internship";
  } else if (
    pageText.includes("part-time") ||
    pageText.includes("part time")
  ) {
    jobType = "Part-time";
  } else if (
    pageText.includes("contract")
  ) {
    jobType = "Contract";
  } else {
    jobType = "Full-time";
  }

  const validPosition =
    position.length >= 3;

  const validCompany =
    company.length >= 2;

  return {
    company: validCompany
      ? company
      : "",

    position: validPosition
      ? position
      : "",

    location,

    jobType,

    jobUrl:
      window.location.href,

    appliedDate:
      new Date().toISOString(),

    source:
      window.location.hostname
        .replace(/^www\./, ""),

    description,

    confidence: {
      company:
        validCompany ? 0.95 : 0,

      position:
        validPosition ? 0.95 : 0,

      location:
        location ? 0.85 : 0,

      jobType:
        jobType ? 0.65 : 0,
    },

    extractionMethod: {
      company:
        validCompany
          ? "linkedin"
          : "",

      position:
        validPosition
          ? "linkedin"
          : "",

      location:
        location
          ? "linkedin"
          : "",

      jobType:
        jobType
          ? "linkedin"
          : "",
    },

    isJobBoard: true,
  };
};

// ==========================================
// Expose Extractor
// ==========================================
window.extractLinkedInJobData =
  extractLinkedInJobData;