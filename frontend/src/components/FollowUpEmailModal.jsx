import { useEffect, useState } from "react";
import {
  X,
  Mail,
  Send,
  Loader2,
  Copy,
  Check,
  Sparkles,
  UserRound,
  FileText,
  ChevronDown,
  TriangleAlert,
} from "lucide-react";

import API from "../services/api";

function FollowUpEmailModal({
  application,
  onClose,
}) {
  const [messageType, setMessageType] = useState(
    "Application Follow-up"
  );

  const [recipientEmail, setRecipientEmail] = useState(
    application?.recruiterEmail || ""
  );

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Generate Email Content
  // ==========================================
  useEffect(() => {
    const company =
      application?.company || "the company";

    const position =
      application?.position || "the position";

    const userName =
      application?.userName || "there";

    if (messageType === "Application Follow-up") {
      setSubject(
        `Follow-up regarding ${position} application at ${company}`
      );

      setMessage(
        `Dear Hiring Team,

I hope you are doing well.

I am writing to follow up on my application for the ${position} position at ${company}. I remain very interested in the opportunity and wanted to kindly check if there are any updates regarding my application.

Please let me know if any additional information is required from my side.

Thank you for your time and consideration.

Best regards,
${userName}`
      );
    }

    if (messageType === "Interview Thank You") {
      setSubject(
        `Thank you for the interview - ${position}`
      );

      setMessage(
        `Dear Hiring Team,

Thank you for taking the time to interview me for the ${position} position at ${company}.

I really appreciate the opportunity to learn more about the role and the company. I remain very interested in the position and look forward to hearing from you.

Thank you again for your time.

Best regards,
${userName}`
      );
    }

    if (messageType === "Status Check") {
      setSubject(
        `Application status update - ${position} at ${company}`
      );

      setMessage(
        `Dear Hiring Team,

I hope you are doing well.

I wanted to kindly check if there has been any update regarding my application for the ${position} position at ${company}.

I remain interested in the opportunity and would appreciate any update you can share.

Thank you for your time.

Best regards,
${userName}`
      );
    }
  }, [messageType, application]);

  // ==========================================
  // Send Email
  // ==========================================
  const handleSendEmail = async () => {
    setError("");
    setSuccess(false);

    const email = recipientEmail.trim();

    if (!email) {
      setError("Please enter the recruiter email.");
      return;
    }

    if (!subject.trim()) {
      setError("Please enter an email subject.");
      return;
    }

    if (!message.trim()) {
      setError("Please enter an email message.");
      return;
    }

    if (!application?._id) {
      setError("Application ID is missing.");
      return;
    }

    try {
      setSending(true);

      await API.post("/email/send", {
        applicationId: application._id,
        to: email,
        subject: subject.trim(),
        message: message.trim(),
      });

      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Send email error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to send email. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  // ==========================================
  // Copy
  // ==========================================
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // ==========================================
  // Escape
  // ==========================================
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !sending) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [onClose, sending]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-sm">

      {/* ========================================
          Success Toast
      ======================================== */}
      {success && (
        <div className="fixed right-4 top-4 z-[70] w-[calc(100%-2rem)] max-w-sm">
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <Check
                size={19}
                className="text-emerald-600"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Email sent successfully
              </p>

              <p className="mt-0.5 text-xs leading-5 text-gray-500">
                Your email has been sent to the recruiter.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          Modal
      ======================================== */}
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.22)]">

        {/* ======================================
            Header
        ====================================== */}
        <div className="border-b border-gray-100 bg-white px-5 py-4 sm:px-6">

          <div className="flex items-start justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                <Mail
                  size={18}
                  className="text-indigo-600"
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold tracking-tight text-gray-950 sm:text-lg">
                  Follow-up Email
                </h2>

                <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
                  {application?.position || "Position"} ·{" "}
                  {application?.company || "Company"}
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={18} />
            </button>

          </div>
        </div>

        {/* ======================================
            Body
        ====================================== */}
        <div className="min-h-0 flex-1 overflow-y-auto">

          <div className="p-5 sm:p-6">

            {/* Application Context */}
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <Sparkles
                  size={16}
                  className="text-indigo-600"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900">
                  Writing to the recruiter
                </p>

                <p className="mt-0.5 truncate text-[11px] text-gray-500">
                  {application?.recruiterEmail ||
                    "Add a recruiter email below"}
                </p>
              </div>

            </div>

            {/* ====================================
                Email Type
            ==================================== */}
            <div className="mb-5">

              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Email Type
              </label>

              <div className="relative">
                <FileText
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={messageType}
                  onChange={(e) =>
                    setMessageType(e.target.value)
                  }
                  disabled={sending}
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-10 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:opacity-60"
                >
                  <option>
                    Application Follow-up
                  </option>

                  <option>
                    Interview Thank You
                  </option>

                  <option>
                    Status Check
                  </option>
                </select>

                <ChevronDownIcon />
              </div>

            </div>

            {/* ====================================
                Recipient
            ==================================== */}
            <div className="mb-5">

              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                To
              </label>

              <div className="relative">
                <UserRound
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) =>
                    setRecipientEmail(
                      e.target.value
                    )
                  }
                  placeholder="recruiter@company.com"
                  disabled={sending}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:opacity-60"
                />
              </div>

              <p className="mt-1.5 text-[11px] text-gray-400">
                Enter the recruiter's email address.
              </p>

            </div>

            {/* ====================================
                Subject
            ==================================== */}
            <div className="mb-5">

              <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                Subject
              </label>

              <input
                type="text"
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                disabled={sending}
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 text-sm text-gray-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:opacity-60"
              />

            </div>

            {/* ====================================
                Message
            ==================================== */}
            <div>

              <div className="mb-1.5 flex items-center justify-between gap-3">

                <label className="block text-xs font-semibold text-gray-600">
                  Message
                </label>

                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={
                    sending || !message
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copied ? (
                    <>
                      <Check size={13} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy
                    </>
                  )}
                </button>

              </div>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                rows={13}
                disabled={sending}
                className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3.5 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:opacity-60"
              />

              <p className="mt-1.5 text-[11px] text-gray-400">
                You can edit the generated message before sending.
              </p>

            </div>

            {/* ====================================
                Error
            ==================================== */}
            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                <TriangleAlert
                  size={17}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <p className="text-sm leading-5 text-red-700">
                  {error}
                </p>

              </div>
            )}

            {/* ====================================
                Info
            ==================================== */}
            {!success && (
              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3">

                <p className="text-[11px] leading-5 text-gray-500">
                  This email will be sent directly through
                  JobTrack using your configured email service.
                </p>

              </div>
            )}

          </div>
        </div>

        {/* ======================================
            Footer
        ====================================== */}
        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">

            <p className="hidden text-[11px] text-gray-400 sm:block">
              Press Esc to close
            </p>

            <div className="flex w-full gap-2 sm:w-auto">

              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendEmail}
                disabled={
                  sending || success
                }
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
              >
                {sending ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                    Sending...
                  </>
                ) : success ? (
                  <>
                    <Check size={15} />
                    Sent
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Email
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ==========================================
   Chevron
========================================== */

function ChevronDownIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default FollowUpEmailModal;