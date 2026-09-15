const path = require("path");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();
app.use(helmet());
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

const allowedOrigins = [
  "http://localhost:5173",
  "chrome-extension://mbabflfabnpoipfjlhkmmhdcnkpmccjk",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resume", resumeRoutes);

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "JobTrack API is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

console.log("EMAIL_USER loaded:", process.env.EMAIL_USER);
console.log("EMAIL_PASS loaded:", !!process.env.EMAIL_PASS);
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});