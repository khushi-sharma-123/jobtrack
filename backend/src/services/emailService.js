const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"JobTrack" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

const sendInterviewScheduledEmail = async ({
  to,
  userName,
  company,
  position,
  interviewDate,
  interviewType,
  interviewLocation,
}) => {
  const formattedDate = new Date(
    interviewDate
  ).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return sendEmail({
    to,
    subject: `Interview Scheduled - ${company} | JobTrack`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>🎉 Interview Scheduled!</h2>

        <p>Hello ${userName},</p>

        <p>
          Your interview has been scheduled successfully.
        </p>

        <h3>Interview Details</h3>

        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Date & Time:</strong> ${formattedDate}</p>
        <p><strong>Type:</strong> ${interviewType}</p>

        ${
          interviewLocation
            ? `<p><strong>Location / Link:</strong> ${interviewLocation}</p>`
            : ""
        }

        <p>
          You can manage this interview and your other applications
          from your JobTrack dashboard.
        </p>

        <p>
          Best of luck! 🚀
        </p>

        <hr />

        <p style="color: #777;">
          This is an automated email from JobTrack.
        </p>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendInterviewScheduledEmail,
};