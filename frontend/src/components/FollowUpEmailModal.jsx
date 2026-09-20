import { useEffect, useState } from "react";
import {
  X,
  Mail,
  Send,
  Loader2,
  Copy,
  Check,
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
  // Generate email content
  // ==========================================

  useEffect(() => {
    const company = application?.company || "the company";
    const position = application?.position || "the position";
    const userName = application?.userName || "there";

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
  // Copy Email
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
  // Close on Escape
  // ==========================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !sending) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, sending]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        {success && (
  <div className="fixed right-5 top-5 z-[60] flex items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-xl">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
      <Check
        size={20}
        className="text-green-600"
      />
    </div>

    <div>
      <p className="font-semibold text-gray-900">
        Mail sent successfully
      </p>

      <p className="text-sm text-gray-500">
        Your email has been sent to the recruiter.
      </p>
    </div>
  </div>
)}
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ==========================================
            Header
        ========================================== */}

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

          <div>
            <div className="flex items-center gap-2">
              <Mail
                size={20}
                className="text-indigo-600"
              />

              <h2 className="text-lg font-semibold text-gray-900">
                Follow-up Email
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {application?.position} · {application?.company}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {/* ==========================================
            Body
        ========================================== */}

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">

          {/* Message Type */}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Type
            </label>

            <select
              value={messageType}
              onChange={(e) =>
                setMessageType(e.target.value)
              }
              disabled={sending}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
          </div>

          {/* Recipient */}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              To
            </label>

            <input
              type="email"
              value={recipientEmail}
              onChange={(e) =>
                setRecipientEmail(e.target.value)
              }
              placeholder="recruiter@company.com"
              disabled={sending}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <p className="mt-1.5 text-xs text-gray-500">
              Enter the recruiter's email address.
            </p>
          </div>

          {/* Subject */}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subject
            </label>

            <input
              type="text"
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              disabled={sending}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Message */}

          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">

              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>

              <button
                type="button"
                onClick={handleCopy}
                disabled={sending}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 transition hover:text-indigo-700 disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} />
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
              rows={12}
              disabled={sending}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Error */}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Email sent successfully.
            </div>
          )}

          {/* Information */}

          {!success && (
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs leading-5 text-indigo-700">
              This email will be sent directly through
              JobTrack using your configured email service.
            </div>
          )}

        </div>

        {/* ==========================================
            Footer
        ========================================== */}

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSendEmail}
            disabled={sending || success}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {sending ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Email
              </>
            )}

          </button>

        </div>

      </div>
    </div>
  );
}

export default FollowUpEmailModal;