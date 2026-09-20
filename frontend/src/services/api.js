import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ======================================================
// AI SERVICES
// ======================================================

// Analyze Job Description
export const analyzeJobDescription = async (jobDescription) => {
  const response = await API.post("/ai/analyze-job", {
    jobDescription,
  });

  return response.data;
};

// Match Resume with Job
export const matchResumeWithJob = async (jobDescription) => {
  const response = await API.post("/ai/match-resume", {
    jobDescription,
  });

  return response.data;
};

// Analyze Skill Gap
export const analyzeSkillGap = async (jobDescription) => {
  const response = await API.post("/ai/skill-gap", {
    jobDescription,
  });

  return response.data;
};

// Generate Interview Preparation
export const generateInterviewPreparation = async (
  jobDescription
) => {
  const response = await API.post("/ai/interview-prep", {
    jobDescription,
  });

  return response.data;
};

// Generate Personalized Recommendations
export const generateRecommendations = async (
  jobDescription
) => {
  const response = await API.post("/ai/recommendations", {
    jobDescription,
  });

  return response.data;
};

export default API;