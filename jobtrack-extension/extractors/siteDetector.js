// ==========================================
// JobTrack Site Detector
// ==========================================

const JOBTRACK_SITES = {
  NAUKRI: "naukri",
  INDEED: "indeed",
  LINKEDIN: "linkedin",
  GENERIC: "generic",
};

// ==========================================
// Get Hostname
// ==========================================
const getHostname = () => {
  return window.location.hostname
    .toLowerCase()
    .replace(/^www\./, "");
};

// ==========================================
// Detect Current Website
// ==========================================
const detectJobSite = () => {
  const hostname = getHostname();

  if (
    hostname === "naukri.com" ||
    hostname.endsWith(".naukri.com")
  ) {
    return JOBTRACK_SITES.NAUKRI;
  }

  if (
    hostname === "indeed.com" ||
    hostname.endsWith(".indeed.com") ||
    hostname.endsWith(".indeed.co.in")
  ) {
    return JOBTRACK_SITES.INDEED;
  }

  if (
    hostname === "linkedin.com" ||
    hostname.endsWith(".linkedin.com")
  ) {
    return JOBTRACK_SITES.LINKEDIN;
  }

  return JOBTRACK_SITES.GENERIC;
};

// ==========================================
// Is Known Job Website
// ==========================================
const isKnownJobSite = () => {
  return (
    detectJobSite() !==
    JOBTRACK_SITES.GENERIC
  );
};

// ==========================================
// Expose Detector
// ==========================================
window.JobTrackSiteDetector = {
  JOBTRACK_SITES,
  getHostname,
  detectJobSite,
  isKnownJobSite,
};