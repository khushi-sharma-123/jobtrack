// ==========================================
// JobTrack Indeed Extractor
// ==========================================

const extractIndeedJobData = () => {
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
  // Job Title
  // ==========================================
  const position = firstText([
    "[data-testid='jobsearch-JobInfoHeader-title']",
    "[data-testid='jobsearch-JobInfoHeader-title'] h1",
    "h1[data-testid='jobsearch-JobInfoHeader-title']",
    "h1",
  ]);

  // ==========================================
  // Company
  // ==========================================
  const company = firstText([
    "[data-testid='inlineHeader-companyName']",
    "[data-testid='inlineHeader-companyName'] a",
    "[data-testid='inlineHeader-companyName'] span",
    "[class*='companyName']",
    "[class*='company-name']",
  ]);

  // ==========================================
  // Location
  // ==========================================
  const location = firstText([
    "[data-testid='job-location']",
    "[data-testid='inlineHeader-companyLocation']",
    "[data-testid='jobsearch-JobInfoHeader-subtitle']",
    "[class*='companyLocation']",
    "[class*='jobLocation']",
  ]);

  // ==========================================
  // Job Description
  // ==========================================
  const description = firstText([
    "#jobDescriptionText",
    "[data-testid='jobDescriptionText']",
    "[class*='jobDescription']",
    "[class*='job-description']",
  ]);

  // ==========================================
  // Job Type
  // ==========================================
  const bodyText =
    clean(document.body?.innerText)
      .toLowerCase();

  let jobType = "";

  if (
    bodyText.includes("internship") ||
    bodyText.includes("intern")
  ) {
    jobType = "Internship";
  } else if (
    bodyText.includes("part-time") ||
    bodyText.includes("part time")
  ) {
    jobType = "Part-time";
  } else if (
    bodyText.includes("contract")
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
        location ? 0.90 : 0,

      jobType:
        jobType ? 0.70 : 0,
    },

    extractionMethod: {
      company:
        validCompany
          ? "indeed"
          : "",

      position:
        validPosition
          ? "indeed"
          : "",

      location:
        location
          ? "indeed"
          : "",

      jobType:
        jobType
          ? "indeed"
          : "",
    },

    isJobBoard: true,
  };
};

// ==========================================
// Expose Extractor
// ==========================================
window.extractIndeedJobData =
  extractIndeedJobData;