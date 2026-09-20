import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  analyzeJobDescription,
  matchResumeWithJob,
  analyzeSkillGap,
  generateInterviewPreparation,
  generateRecommendations,
} from "../services/api";

function AIAnalyzer() {

  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState("");

  const [jobAnalysis, setJobAnalysis] = useState(null);
  const [resumeMatch, setResumeMatch] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [interviewPrep, setInterviewPrep] = useState(null);
  const [recommendations, setRecommendations] =
    useState(null);

  const [error, setError] = useState("");

  // ======================================================
  // RUN AI FEATURE
  // ======================================================

  const runFeature = async (feature) => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description first.");
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError(
        "Job description must contain at least 50 characters."
      );
      return;
    }

    setError("");
    setLoading(true);
    setActiveFeature(feature);

    try {
      let response;

      switch (feature) {
        case "analysis":
          response =
            await analyzeJobDescription(
              jobDescription
            );
          setJobAnalysis(response.analysis);
          break;

        case "match":
          response =
            await matchResumeWithJob(
              jobDescription
            );
          setResumeMatch(response.matching);
          break;

        case "skillGap":
          response =
            await analyzeSkillGap(
              jobDescription
            );
          setSkillGap(response.skillGap);
          break;

        case "interview":
          response =
            await generateInterviewPreparation(
              jobDescription
            );
          setInterviewPrep(
            response.interviewPrep
          );
          break;

        case "recommendations":
          response =
            await generateRecommendations(
              jobDescription
            );
          setRecommendations(
            response.recommendations
          );
          break;

        default:
          break;
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
      setActiveFeature("");
    }
  };

  // ======================================================
  // RUN ALL FEATURES
  // ======================================================

  const runAllFeatures = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description first.");
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError(
        "Job description must contain at least 50 characters."
      );
      return;
    }

    setError("");
    setLoading(true);
    setActiveFeature("all");

    try {
      const [
        analysisResponse,
        matchResponse,
        skillGapResponse,
        interviewResponse,
        recommendationResponse,
      ] = await Promise.all([
        analyzeJobDescription(jobDescription),
        matchResumeWithJob(jobDescription),
        analyzeSkillGap(jobDescription),
        generateInterviewPreparation(
          jobDescription
        ),
        generateRecommendations(
          jobDescription
        ),
      ]);

      setJobAnalysis(
        analysisResponse.analysis
      );

      setResumeMatch(
        matchResponse.matching
      );

      setSkillGap(
        skillGapResponse.skillGap
      );

      setInterviewPrep(
        interviewResponse.interviewPrep
      );

      setRecommendations(
        recommendationResponse.recommendations
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to complete AI analysis."
      );
    } finally {
      setLoading(false);
      setActiveFeature("");
    }
  };

  // ======================================================
  // CLEAR RESULTS
  // ======================================================

  const clearResults = () => {
    setJobAnalysis(null);
    setResumeMatch(null);
    setSkillGap(null);
    setInterviewPrep(null);
    setRecommendations(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}
            <button
      onClick={() => navigate(-1)}
      className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
      ← Back
    </button>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Career Assistant
          </h1>

          <p className="mt-2 text-gray-600">
            Analyze a job, compare it with your resume,
            identify skill gaps, prepare for interviews,
            and get personalized recommendations.
          </p>
        </div>

        {/* ==================================================
            JOB DESCRIPTION INPUT
        ================================================== */}

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Job Description
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Paste the job description you want to
                analyze.
              </p>
            </div>

            {(jobAnalysis ||
              resumeMatch ||
              skillGap ||
              interviewPrep ||
              recommendations) && (
              <button
                onClick={clearResults}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear Results
              </button>
            )}
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            placeholder="Paste the complete job description here..."
            rows={10}
            maxLength={15000}
            className="w-full resize-y rounded-lg border border-gray-300 p-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>
              Minimum 50 characters
            </span>

            <span>
              {jobDescription.length}/15000
            </span>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ==================================================
              ACTION BUTTONS
          ================================================== */}

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              onClick={() =>
                runFeature("analysis")
              }
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {activeFeature === "analysis"
                ? "Analyzing..."
                : "Analyze Job"}
            </button>

            <button
              onClick={() =>
                runFeature("match")
              }
              disabled={loading}
              className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {activeFeature === "match"
                ? "Matching..."
                : "Match Resume"}
            </button>

            <button
              onClick={() =>
                runFeature("skillGap")
              }
              disabled={loading}
              className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {activeFeature === "skillGap"
                ? "Analyzing..."
                : "Skill Gap"}
            </button>

            <button
              onClick={() =>
                runFeature("interview")
              }
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {activeFeature === "interview"
                ? "Preparing..."
                : "Interview Prep"}
            </button>

            <button
              onClick={() =>
                runFeature("recommendations")
              }
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {activeFeature === "recommendations"
                ? "Generating..."
                : "Recommendations"}
            </button>

            <button
              onClick={runAllFeatures}
              disabled={loading}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {activeFeature === "all"
                ? "Running AI..."
                : "Run Complete Analysis"}
            </button>
          </div>
        </div>

        {/* ==================================================
            JOB ANALYSIS
        ================================================== */}

        {jobAnalysis && (
          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Job Analysis
            </h2>

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <p className="text-gray-700">
                {jobAnalysis.summary}
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">

                <InfoList
                  title="Required Skills"
                  items={
                    jobAnalysis.requiredSkills
                  }
                />

                <InfoList
                  title="Preferred Skills"
                  items={
                    jobAnalysis.preferredSkills
                  }
                />

                <InfoList
                  title="Technologies"
                  items={
                    jobAnalysis.technologies
                  }
                />

                <InfoList
                  title="Key Responsibilities"
                  items={
                    jobAnalysis.keyResponsibilities
                  }
                />

              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">

                <InfoBox
                  title="Experience"
                  value={
                    jobAnalysis.experienceRequired
                  }
                />

                <InfoBox
                  title="Education"
                  value={
                    jobAnalysis.educationRequirements
                  }
                />

                <InfoBox
                  title="Experience Level"
                  value={
                    jobAnalysis.experienceLevel
                  }
                />

              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            RESUME MATCH
        ================================================== */}

        {resumeMatch && (
          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Resume Match
            </h2>

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <div className="mb-6 flex flex-col items-center justify-center">

                <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-purple-100">
                  <span className="text-4xl font-bold text-purple-600">
                    {resumeMatch.matchScore}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Resume Match Score
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">

                <InfoList
                  title="Matched Skills"
                  items={
                    resumeMatch.matchedSkills
                  }
                />

                <InfoList
                  title="Missing Skills"
                  items={
                    resumeMatch.missingSkills
                  }
                />

                <InfoList
                  title="Strengths"
                  items={
                    resumeMatch.strengths
                  }
                />

              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                <InfoBox
                  title="Experience Match"
                  value={
                    resumeMatch.experienceMatch
                  }
                />

                <InfoBox
                  title="Education Match"
                  value={
                    resumeMatch.educationMatch
                  }
                />

              </div>

              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">
                  Assessment
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {resumeMatch.assessment}
                </p>
              </div>

            </div>
          </section>
        )}

        {/* ==================================================
            SKILL GAP
        ================================================== */}

        {skillGap && (
          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Skill Gap Analysis
            </h2>

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <p className="mb-6 text-gray-700">
                {skillGap.summary}
              </p>

              <div className="grid gap-6 md:grid-cols-3">

                <InfoList
                  title="Required Skills"
                  items={
                    skillGap.requiredSkills
                  }
                />

                <InfoList
                  title="Matched Skills"
                  items={
                    skillGap.matchedSkills
                  }
                />

                <InfoList
                  title="Missing Skills"
                  items={
                    skillGap.missingSkills
                  }
                />

              </div>

              <div className="mt-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Skill Gaps
                </h3>

                <div className="space-y-3">

                  {skillGap.skillGaps.map(
                    (gap, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">

                          <h4 className="font-semibold text-gray-900">
                            {gap.skill}
                          </h4>

                          <PriorityBadge
                            priority={gap.priority}
                          />

                        </div>

                        <p className="mt-2 text-sm text-gray-600">
                          {gap.reason}
                        </p>
                      </div>
                    )
                  )}

                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            INTERVIEW PREPARATION
        ================================================== */}

        {interviewPrep && (
          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Interview Preparation
            </h2>

            <div className="space-y-6">

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">
                  Preparation Summary
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {
                    interviewPrep.preparationSummary
                  }
                </p>
              </div>

              <QuestionSection
                title="Technical Questions"
                questions={
                  interviewPrep.technicalQuestions
                }
                type="technical"
              />

              <QuestionSection
                title="Behavioral Questions"
                questions={
                  interviewPrep.behavioralQuestions
                }
                type="behavioral"
              />

              <QuestionSection
                title="Resume-Based Questions"
                questions={
                  interviewPrep.resumeBasedQuestions
                }
                type="resume"
              />

            </div>
          </section>
        )}

        {/* ==================================================
            RECOMMENDATIONS
        ================================================== */}

        {recommendations && (
          <section className="mt-8 pb-12">

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Personalized Recommendations
            </h2>

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900">
                  Profile Summary
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {
                    recommendations.profileSummary
                  }
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">

                {recommendations.recommendations.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-4"
                    >

                      <div className="flex items-center justify-between gap-2">

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                          {item.area}
                        </span>

                        <PriorityBadge
                          priority={item.priority}
                        />

                      </div>

                      <h4 className="mt-3 font-semibold text-gray-900">
                        {item.recommendation}
                      </h4>

                      <p className="mt-2 text-sm text-gray-600">
                        {item.reason}
                      </p>

                    </div>
                  )
                )}

              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">

                <InfoList
                  title="Strengths"
                  items={
                    recommendations.strengths
                  }
                />

                <InfoList
                  title="Focus Areas"
                  items={
                    recommendations.focusAreas
                  }
                />

              </div>

            </div>
          </section>
        )}

      </div>
    </div>
  );
}

// ======================================================
// REUSABLE COMPONENTS
// ======================================================

function InfoList({ title, items = [] }) {
  return (
    <div>
      <h3 className="mb-3 font-semibold text-gray-900">
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">
          No information available.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InfoBox({ title, value }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-sm text-gray-700">
        {value || "Not specified"}
      </p>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[priority] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {priority}
    </span>
  );
}

function QuestionSection({
  title,
  questions = [],
  type,
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">

      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <div className="space-y-4">

        {questions.map(
          (item, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 p-5"
            >

              <div className="flex flex-wrap items-start justify-between gap-3">

                <h4 className="font-semibold text-gray-900">
                  {index + 1}.{" "}
                  {item.question}
                </h4>

                {type === "technical" &&
                  item.difficulty && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {item.difficulty}
                    </span>
                  )}

              </div>

              {item.topic && (
                <p className="mt-2 text-xs font-medium text-gray-500">
                  Topic: {item.topic}
                </p>
              )}

              {item.reason && (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Why this question?
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {item.reason}
                  </p>
                </div>
              )}

              {item.whatInterviewerEvaluates && (
                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Interviewer evaluates
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {
                      item.whatInterviewerEvaluates
                    }
                  </p>
                </div>
              )}

              {item.answerPoints?.length > 0 && (
                <div className="mt-4">

                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Answer Points
                  </p>

                  <ul className="mt-2 space-y-1">
                    {item.answerPoints.map(
                      (point, pointIndex) => (
                        <li
                          key={pointIndex}
                          className="text-sm text-gray-600"
                        >
                          • {point}
                        </li>
                      )
                    )}
                  </ul>

                </div>
              )}

            </div>
          )
        )}

      </div>
    </div>
  );
}

export default AIAnalyzer;