
// ==========================================
// JobTrack Generic Job Extractor
// ==========================================

// ==========================================
// Text Cleaning
// ==========================================
const cleanText = (value) => {
  if (!value) return "";

  return String(value)
    .replace(/\s+/g, " ")
    .trim();
};

// ==========================================
// Check if Extracted Text is Meaningful
// ==========================================
const isMeaningfulText = (
  value,
  minLength = 2
) => {
  const text = cleanText(value);

  if (!text || text.length < minLength) {
    return false;
  }

  const ignoredValues = [
    "job",
    "jobs",
    "job posting",
    "job opening",
    "career",
    "careers",
    "apply",
    "apply now",
    "home",
    "untitled",
    "undefined",
    "null",
    "n/a",
    "na",
  ];

  if (
    ignoredValues.includes(
      text.toLowerCase()
    )
  ) {
    return false;
  }

  return true;
};

// ==========================================
// Job Board Domains
// ==========================================
const JOB_BOARD_DOMAINS = [
  "linkedin.com",
  "indeed.com",
  "naukri.com",
  "glassdoor.com",
  "monster.com",
  "ziprecruiter.com",
  "dice.com",
  "wellfound.com",
  "simplyhired.com",
  "careerbuilder.com",
  "foundit.in",
];

// ==========================================
// Check if Current Website is a Job Board
// ==========================================
const isJobBoardDomain = () => {
  const hostname =
    window.location.hostname
      .toLowerCase()
      .replace(/^www\./, "");

  return JOB_BOARD_DOMAINS.some(
    (domain) =>
      hostname === domain ||
      hostname.endsWith(`.${domain}`)
  );
};

// ==========================================
// Get Current Domain
// ==========================================
const getCurrentDomain = () => {
  return window.location.hostname
    .replace(/^www\./, "")
    .toLowerCase();
};

// ==========================================
// JSON-LD JobPosting Extraction
// ==========================================
const getJsonLdJobPosting = () => {
  const scripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );

  for (const script of scripts) {
    try {
      const data = JSON.parse(
        script.textContent
      );

      const items = [];

      if (Array.isArray(data)) {
        items.push(...data);
      } else {
        items.push(data);

        if (Array.isArray(data["@graph"])) {
          items.push(...data["@graph"]);
        }
      }

      for (const item of items) {
        if (!item) continue;

        const type = item["@type"];

        if (
          type === "JobPosting" ||
          (Array.isArray(type) &&
            type.includes("JobPosting"))
        ) {
          return item;
        }
      }
    } catch (error) {
      // Ignore invalid JSON-LD
    }
  }

  return null;
};

// ==========================================
// Extract Location from JSON-LD
// ==========================================
const getLocationFromJobPosting = (job) => {
  const location = job?.jobLocation;

  if (!location) return "";

  const locations = Array.isArray(location)
    ? location
    : [location];

  return locations
    .map((item) => {
      const address = item?.address;

      if (!address) return "";

      if (typeof address === "string") {
        return cleanText(address);
      }

      return [
        address.streetAddress,
        address.addressLocality,
        address.addressRegion,
        address.postalCode,
        address.addressCountry,
      ]
        .filter(Boolean)
        .map(cleanText)
        .filter(Boolean)
        .join(", ");
    })
    .filter(Boolean)
    .join(" | ");
};

// ==========================================
// Meta Extraction
// ==========================================
const extractFromMeta = (property) => {
  const element = document.querySelector(
    `meta[property="${property}"]`
  );

  return cleanText(element?.content);
};

// ==========================================
// Name Meta Extraction
// ==========================================
const extractFromNameMeta = (name) => {
  const element = document.querySelector(
    `meta[name="${name}"]`
  );

  return cleanText(element?.content);
};

// ==========================================
// Extract Text from Selectors
// ==========================================
const extractFromSelectors = (
  selectors
) => {
  for (const selector of selectors) {
    try {
      const element =
        document.querySelector(selector);

      if (!element) {
        continue;
      }

      const text = cleanText(
        element.innerText ||
          element.textContent
      );

      if (isMeaningfulText(text)) {
        return text;
      }
    } catch (error) {
      // Ignore invalid selectors
    }
  }

  return "";
};

// ==========================================
// Normalize Job Type
// ==========================================
const normalizeJobType = (jobType) => {
  const value = cleanText(
    jobType
  ).toUpperCase();

  if (!value) {
    return "";
  }

  if (
    value.includes("INTERN") ||
    value.includes("TRAINEE")
  ) {
    return "Internship";
  }

  if (
    value.includes("FULL_TIME") ||
    value.includes("FULL-TIME") ||
    value.includes("FULL TIME") ||
    value === "FULLTIME"
  ) {
    return "Full-time";
  }

  if (
    value.includes("PART_TIME") ||
    value.includes("PART-TIME") ||
    value.includes("PART TIME") ||
    value === "PARTTIME"
  ) {
    return "Part-time";
  }

  if (
    value.includes("CONTRACT") ||
    value.includes("CONTRACTOR")
  ) {
    return "Contract";
  }

  return "";
};

// ==========================================
// Extract Job Title
// ==========================================
const extractJobTitle = () => {
  const title =
    extractFromSelectors([
      "[data-testid='job-title']",
      "[data-testid='jobTitle']",
      "[data-job-title]",
      "[itemprop='title']",
      ".job-title",
      ".jobTitle",
      ".job-title-text",
      ".posting-title",
      ".job-details h1",
      ".job-header h1",
      "main h1",
      "article h1",
      "h1",
    ]);

  if (isMeaningfulText(title, 3)) {
    return title;
  }

  const metaTitle =
    extractFromMeta("og:title") ||
    extractFromNameMeta("twitter:title");

  if (
    isMeaningfulText(metaTitle, 3)
  ) {
    return metaTitle;
  }

  const documentTitle =
    cleanText(document.title);

  return isMeaningfulText(
    documentTitle,
    3
  )
    ? documentTitle
    : "";
};

// ==========================================
// Extract Company Name
// ==========================================
const extractCompanyName = () => {
  const company =
    extractFromSelectors([
      "[data-testid='company-name']",
      "[data-testid='companyName']",
      "[data-company-name]",
      "[itemprop='hiringOrganization']",
      "[itemprop='hiringOrganization'] [itemprop='name']",

      ".company-name",
      ".companyName",
      ".employer-name",
      ".employerName",
      ".company",
      ".employer",

      "[class*='company-name']",
      "[class*='companyName']",
      "[class*='employer-name']",
      "[class*='employerName']",
    ]);

  if (
    isMeaningfulText(company, 2)
  ) {
    return company;
  }

  return "";
};

// ==========================================
// Extract Job Location
// ==========================================
const extractJobLocation = () => {
  const location =
    extractFromSelectors([
      "[data-testid='job-location']",
      "[data-testid='jobLocation']",
      "[data-location]",
      "[itemprop='jobLocation']",
      "[itemprop='addressLocality']",

      ".job-location",
      ".jobLocation",
      ".job-location-text",
      ".location",
      ".job-details .location",
      ".job-header .location",

      "[class*='job-location']",
      "[class*='jobLocation']",
    ]);

  if (
    isMeaningfulText(location, 2)
  ) {
    return location;
  }

  return "";
};

// ==========================================
// Extract Job Type
// ==========================================
const extractJobType = () => {
  const value =
    extractFromSelectors([
      "[data-testid='job-type']",
      "[data-testid='jobType']",
      "[data-job-type]",
      "[itemprop='employmentType']",

      ".job-type",
      ".jobType",
      ".employment-type",
      ".employmentType",

      "[class*='job-type']",
      "[class*='jobType']",
      "[class*='employment-type']",
      "[class*='employmentType']",
    ]);

  return normalizeJobType(value);
};

// ==========================================
// Extract Company from Page Title
// ==========================================
const extractCompanyFromTitle = (
  title
) => {
  if (!title) {
    return "";
  }

  const separators = [
    " | ",
    " - ",
    " – ",
    " — ",
    " @ ",
  ];

  for (const separator of separators) {
    const parts = title
      .split(separator)
      .map(cleanText)
      .filter(Boolean);

    if (parts.length < 2) {
      continue;
    }

    // Common pattern:
    // Job Title | Company
    // Job Title - Company
    // Job Title @ Company
    const possibleCompany =
      parts[parts.length - 1];

    if (
      !isMeaningfulText(
        possibleCompany,
        2
      )
    ) {
      continue;
    }

    // Avoid obvious job-board names
    const normalized =
      possibleCompany.toLowerCase();

    if (
      JOB_BOARD_DOMAINS.some(
        (domain) =>
          normalized ===
            domain.split(".")[0] ||
          normalized.includes(
            domain.split(".")[0]
          )
      )
    ) {
      continue;
    }

    return possibleCompany;
  }

  return "";
};

// ==========================================
// Extract Company from URL
// ==========================================
const extractCompanyFromUrl = () => {
  try {
    // Never use job-board domains
    if (isJobBoardDomain()) {
      return "";
    }

    const hostname =
      window.location.hostname
        .replace(/^www\./, "")
        .split(".")[0];

    if (!hostname) {
      return "";
    }

    const ignoredDomains = [
      "localhost",
      "127",
      "google",
      "bing",
      "yahoo",
      "facebook",
      "twitter",
      "instagram",
    ];

    if (
      ignoredDomains.includes(hostname)
    ) {
      return "";
    }

    const company = hostname
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );

    return isMeaningfulText(company, 2)
      ? company
      : "";
  } catch (error) {
    return "";
  }
};

// ==========================================
// Extract Description
// ==========================================
const extractDescription = () => {
  const description =
    extractFromMeta("og:description") ||
    extractFromNameMeta("description");

  return isMeaningfulText(
    description,
    10
  )
    ? description
    : "";
};

// ==========================================
// Build Result
// ==========================================
const buildResult = ({
  company,
  position,
  location,
  jobType,
  jobUrl,
  description,
  methods,
}) => {
  const validCompany =
    isMeaningfulText(company)
      ? cleanText(company)
      : "";

  const validPosition =
    isMeaningfulText(position, 3)
      ? cleanText(position)
      : "";

  const validLocation =
    isMeaningfulText(location, 2)
      ? cleanText(location)
      : "";

  const validJobType =
    normalizeJobType(jobType);

  // ==========================================
  // Confidence Calculation
  // ==========================================
  const confidence = {
    company: validCompany
      ? methods.company === "json-ld"
        ? 0.98
        : methods.company === "html"
        ? 0.90
        : methods.company === "title"
        ? 0.75
        : methods.company === "url"
        ? 0.45
        : 0.30
      : 0,

    position: validPosition
      ? methods.position === "json-ld"
        ? 0.98
        : methods.position === "html"
        ? 0.90
        : methods.position === "meta"
        ? 0.75
        : 0.60
      : 0,

    location: validLocation
      ? methods.location === "json-ld"
        ? 0.95
        : methods.location === "html"
        ? 0.85
        : 0.50
      : 0,

    jobType: validJobType
      ? methods.jobType === "json-ld"
        ? 0.95
        : methods.jobType === "html"
        ? 0.85
        : 0.50
      : 0,
  };

  return {
    company: validCompany,
    position: validPosition,
    location: validLocation,
    jobType: validJobType,

    jobUrl:
      cleanText(jobUrl) ||
      window.location.href,

    appliedDate:
      new Date().toISOString(),

    source:
      getCurrentDomain(),

    description:
      cleanText(description),

    confidence,

    extractionMethod: methods,

    isJobBoard:
      isJobBoardDomain(),
  };
};

// ==========================================
// Main Generic Job Data Extractor
// ==========================================
const extractGenericJobData = () => {
  const methods = {
    company: "",
    position: "",
    location: "",
    jobType: "",
  };

  // ==========================================
  // 1. JSON-LD JobPosting
  // ==========================================
  const jobPosting =
    getJsonLdJobPosting();

  if (jobPosting) {
    const jsonTitle =
      cleanText(jobPosting.title);

    const jsonCompany =
      cleanText(
        jobPosting
          .hiringOrganization?.name
      );

    const jsonLocation =
      getLocationFromJobPosting(
        jobPosting
      );

    const jsonJobType =
      normalizeJobType(
        jobPosting.employmentType
      );

    const company =
      isMeaningfulText(jsonCompany)
        ? jsonCompany
        : "";

    const position =
      isMeaningfulText(
        jsonTitle,
        3
      )
        ? jsonTitle
        : "";

    const location =
      isMeaningfulText(
        jsonLocation,
        2
      )
        ? jsonLocation
        : "";

    const jobType =
      jsonJobType;

    if (company) {
      methods.company =
        "json-ld";
    }

    if (position) {
      methods.position =
        "json-ld";
    }

    if (location) {
      methods.location =
        "json-ld";
    }

    if (jobType) {
      methods.jobType =
        "json-ld";
    }

    // ==========================================
    // Fallbacks for Missing Fields
    // ==========================================
    const htmlCompany =
      extractCompanyName();

    const htmlPosition =
      extractJobTitle();

    const htmlLocation =
      extractJobLocation();

    const htmlJobType =
      extractJobType();

    const finalCompany =
      company ||
      htmlCompany ||
      extractCompanyFromTitle(
        htmlPosition ||
          cleanText(document.title)
      ) ||
      extractCompanyFromUrl();

    const finalPosition =
      position ||
      htmlPosition;

    const finalLocation =
      location ||
      htmlLocation;

    const finalJobType =
      jobType ||
      htmlJobType;

    if (!company && htmlCompany) {
      methods.company = "html";
    } else if (
      !company &&
      !htmlCompany &&
      extractCompanyFromTitle(
        htmlPosition ||
          cleanText(document.title)
      )
    ) {
      methods.company = "title";
    } else if (
      !company &&
      !htmlCompany &&
      !extractCompanyFromTitle(
        htmlPosition ||
          cleanText(document.title)
      ) &&
      extractCompanyFromUrl()
    ) {
      methods.company = "url";
    }

    if (!position && htmlPosition) {
      methods.position = "html";
    }

    if (!location && htmlLocation) {
      methods.location = "html";
    }

    if (!jobType && htmlJobType) {
      methods.jobType = "html";
    }

    return buildResult({
      company: finalCompany,
      position: finalPosition,
      location: finalLocation,
      jobType: finalJobType,
      jobUrl:
        cleanText(jobPosting.url) ||
        window.location.href,
      description:
        cleanText(
          jobPosting.description
        ) ||
        extractDescription(),
      methods,
    });
  }

  // ==========================================
  // 2. HTML / Meta Fallback
  // ==========================================
  const htmlPosition =
    extractJobTitle();

  const htmlCompany =
    extractCompanyName();

  const htmlLocation =
    extractJobLocation();

  const htmlJobType =
    extractJobType();

  const metaTitle =
    extractFromMeta("og:title") ||
    extractFromNameMeta(
      "twitter:title"
    );

  // ==========================================
  // Position Fallback
  // ==========================================
  let position = htmlPosition;

  if (
    !position &&
    isMeaningfulText(metaTitle, 3)
  ) {
    position = metaTitle;
    methods.position = "meta";
  } else if (position) {
    methods.position = "html";
  }

  // ==========================================
  // Company Fallback
  // ==========================================
  let company = htmlCompany;

  if (company) {
    methods.company = "html";
  }

  if (!company) {
    const titleCompany =
      extractCompanyFromTitle(
        cleanText(document.title)
      );

    if (titleCompany) {
      company = titleCompany;
      methods.company = "title";
    }
  }

  if (!company) {
    const urlCompany =
      extractCompanyFromUrl();

    if (urlCompany) {
      company = urlCompany;
      methods.company = "url";
    }
  }

  // ==========================================
  // Location
  // ==========================================
  const location =
    htmlLocation;

  if (location) {
    methods.location = "html";
  }

  // ==========================================
  // Job Type
  // ==========================================
  const jobType =
    htmlJobType;

  if (jobType) {
    methods.jobType = "html";
  }

  // ==========================================
  // Description
  // ==========================================
  const description =
    extractDescription();

  // ==========================================
  // Final Result
  // ==========================================
  return buildResult({
    company,
    position,
    location,
    jobType,
    jobUrl:
      window.location.href,
    description,
    methods,
  });
};

// ==========================================
// Make Function Available to Content Script
// ==========================================
window.extractGenericJobData =
  extractGenericJobData;

