// ==========================================
// JobTrack Naukri Extractor
// ==========================================

const extractNaukriJobData = () => {
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

  const title = firstText([
    "h1.styles_jd-header-title__rZwM1",
    "h1.styles_jd-header-title__vW7QG",
    ".jd-header-title",
    ".styles_jd-header-title__uF8eA",
    "[class*='jd-header-title']",
    "h1",
  ]);

  const company = firstText([
    ".styles_jd-header-comp-name__MvqAI",
    ".styles_jd-header-comp-name__9R2jR",
    ".jd-header-comp-name",
    "[class*='jd-header-comp-name']",
    "[class*='company-name']",
  ]);

  const location = firstText([
    ".styles_jhc__location__bJ9ZP",
    ".styles_jhc__location__B7f6x",
    ".loc",
    "[class*='location']",
  ]);

  const experience = firstText([
    ".styles_jhc__exp__k_giM",
    ".styles_jhc__exp__uD4iM",
    "[class*='exp']",
  ]);

  const jobTypeText = firstText([
    ".styles_jhc__jd-header-tags__Kx7X5",
    "[class*='job-type']",
    "[class*='employment']",
  ]);

  let jobType = "";

  const combinedJobType =
    `${jobTypeText} ${experience}`.toLowerCase();

  if (
    combinedJobType.includes("intern")
  ) {
    jobType = "Internship";
  } else if (
    combinedJobType.includes("part time") ||
    combinedJobType.includes("part-time")
  ) {
    jobType = "Part-time";
  } else if (
    combinedJobType.includes("contract")
  ) {
    jobType = "Contract";
  } else {
    jobType = "Full-time";
  }

  const description = firstText([
    ".styles_JDC__dang-inner-html__h0K4t",
    ".dang-inner-html",
    "[class*='dang-inner-html']",
    "[class*='job-desc']",
  ]);

  const validTitle =
    title.length >= 3;

  const validCompany =
    company.length >= 2;

  return {
    company: validCompany
      ? company
      : "",

    position: validTitle
      ? title
      : "",

    location,

    jobType,

    jobUrl:
      window.location.href,

    appliedDate:
      new Date().toISOString(),

    source:
      "naukri.com",

    description,

    confidence: {
      company:
        validCompany ? 0.95 : 0,

      position:
        validTitle ? 0.95 : 0,

      location:
        location ? 0.90 : 0,

      jobType:
        jobType ? 0.85 : 0,
    },

    extractionMethod: {
      company:
        validCompany
          ? "naukri"
          : "",

      position:
        validTitle
          ? "naukri"
          : "",

      location:
        location
          ? "naukri"
          : "",

      jobType:
        jobType
          ? "naukri"
          : "",
    },

    isJobBoard: true,
  };
};

// ==========================================
// Expose Extractor
// ==========================================
window.extractNaukriJobData =
  extractNaukriJobData;