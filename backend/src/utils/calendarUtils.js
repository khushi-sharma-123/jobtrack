const generateGoogleCalendarUrl = ({
  company,
  position,
  interviewDate,
  interviewDuration = 60,
  interviewType,
  interviewLocation,
  interviewNotes,
}) => {
  const startDate = new Date(interviewDate);

  const endDate = new Date(
    startDate.getTime() + interviewDuration * 60 * 1000
  );

  const formatDate = (date) => {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  };

  const title = `Interview - ${company} | ${position}`;

  const details = [
    `Company: ${company}`,
    `Position: ${position}`,
    `Type: ${interviewType || "Online"}`,
    interviewNotes ? `Notes: ${interviewNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details,
  });

  if (interviewLocation) {
    params.append("location", interviewLocation);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

module.exports = {
  generateGoogleCalendarUrl,
};