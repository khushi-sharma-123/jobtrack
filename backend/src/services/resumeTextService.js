const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

// ==========================================
// Constants
// ==========================================

const MAX_RESUME_TEXT_LENGTH = 30000;

// ==========================================
// Clean Extracted Text
// ==========================================

const cleanText = (text) => {
  if (!text) {
    return "";
  }

  return String(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

// ==========================================
// Extract Text From PDF
// ==========================================

const extractPdfText = async (buffer) => {
  let parser;

  try {
    parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    return cleanText(result.text);
  } catch (error) {
    console.error(
      "PDF text extraction error:",
      error.message
    );

    const extractionError = new Error(
      "Unable to extract text from PDF"
    );

    extractionError.code =
      "PDF_TEXT_EXTRACTION_ERROR";

    throw extractionError;
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (destroyError) {
        console.error(
          "PDF parser cleanup error:",
          destroyError.message
        );
      }
    }
  }
};

// ==========================================
// Extract Text From DOCX
// ==========================================

const extractDocxText = async (buffer) => {
  try {
    const result =
      await mammoth.extractRawText({
        buffer,
      });

    return cleanText(result.value);
  } catch (error) {
    console.error(
      "DOCX text extraction error:",
      error.message
    );

    const extractionError = new Error(
      "Unable to extract text from DOCX"
    );

    extractionError.code =
      "DOCX_TEXT_EXTRACTION_ERROR";

    throw extractionError;
  }
};

// ==========================================
// Extract Resume Text
// ==========================================

const extractResumeText = async (
  buffer,
  mimetype
) => {
  if (
    !buffer ||
    !Buffer.isBuffer(buffer)
  ) {
    const error = new Error(
      "Resume file buffer is required"
    );

    error.code =
      "INVALID_RESUME_BUFFER";

    throw error;
  }

  switch (mimetype) {
    case "application/pdf":
      return extractPdfText(buffer);

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return extractDocxText(buffer);

    case "application/msword": {
      // Old .doc files are not supported by
      // Mammoth. We currently support PDF
      // and DOCX for text extraction.

      const docError = new Error(
        "Text extraction for DOC files is not supported yet"
      );

      docError.code =
        "DOC_TEXT_EXTRACTION_UNSUPPORTED";

      throw docError;
    }

    default: {
      const typeError = new Error(
        "Unsupported resume file type"
      );

      typeError.code =
        "UNSUPPORTED_RESUME_TYPE";

      throw typeError;
    }
  }
};

// ==========================================
// Prepare Resume Text For AI
// ==========================================

const prepareResumeText = (resumeText) => {
  if (
    typeof resumeText !== "string" ||
    !resumeText.trim()
  ) {
    const error = new Error(
      "Resume text is not available"
    );

    error.code =
      "RESUME_TEXT_NOT_AVAILABLE";

    throw error;
  }

  let cleanedText = cleanText(
    resumeText
  );

  if (!cleanedText) {
    const error = new Error(
      "Resume does not contain readable text"
    );

    error.code =
      "EMPTY_RESUME_TEXT";

    throw error;
  }

  // Prevent unnecessarily large resume
  // content from being sent to the AI service.
  if (
    cleanedText.length >
    MAX_RESUME_TEXT_LENGTH
  ) {
    cleanedText =
      cleanedText.slice(
        0,
        MAX_RESUME_TEXT_LENGTH
      );
  }

  return cleanedText;
};

// ==========================================
// Exports
// ==========================================

module.exports = {
  extractResumeText,
  prepareResumeText,
};