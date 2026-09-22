import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileSearch,
  Lightbulb,
  Loader2,
  MessageSquareText,
  RefreshCcw,
  Sparkles,
  Target,
  TriangleAlert,
  UserRoundCheck,
  Zap,
} from "lucide-react";

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

  // ==========================================
  // Validation
  // ==========================================
  const validateJobDescription = () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description first.");
      return false;
    }

    if (jobDescription.trim().length < 50) {
      setError(
        "Job description must contain at least 50 characters."
      );
      return false;
    }

    return true;
  };

  // ==========================================
  // Run Single AI Feature
  // ==========================================
  const runFeature = async (feature) => {
    if (!validateJobDescription()) {
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

  // ==========================================
  // Run Everything
  // ==========================================
  const runAllFeatures = async () => {
    if (!validateJobDescription()) {
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

  // ==========================================
  // Clear Results
  // ==========================================
  const clearResults = () => {
    setJobAnalysis(null);
    setResumeMatch(null);
    setSkillGap(null);
    setInterviewPrep(null);
    setRecommendations(null);
    setError("");
  };

  const hasResults =
    jobAnalysis ||
    resumeMatch ||
    skillGap ||
    interviewPrep ||
    recommendations;

  // ==========================================
  // Feature Cards
  // ==========================================
  const features = [
    {
      id: "analysis",
      title: "Analyze Job",
      description:
        "Understand responsibilities, technologies, skills and experience requirements.",
      icon: FileSearch,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      button:
        activeFeature === "analysis"
          ? "Analyzing..."
          : "Analyze Job",
    },
    {
      id: "match",
      title: "Match Resume",
      description:
        "Compare your resume against the job and identify strengths and missing skills.",
      icon: Target,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      button:
        activeFeature === "match"
          ? "Matching..."
          : "Match Resume",
    },
    {
      id: "skillGap",
      title: "Skill Gap",
      description:
        "Discover the skills you should improve before applying or interviewing.",
      icon: BarChart3,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      button:
        activeFeature === "skillGap"
          ? "Analyzing..."
          : "Find Skill Gaps",
    },
    {
      id: "interview",
      title: "Interview Prep",
      description:
        "Generate technical, behavioral and resume-based interview questions.",
      icon: MessageSquareText,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      button:
        activeFeature === "interview"
          ? "Preparing..."
          : "Prepare Interview",
    },
    {
      id: "recommendations",
      title: "Recommendations",
      description:
        "Get personalized suggestions for improving your profile and preparation.",
      icon: Lightbulb,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      button:
        activeFeature === "recommendations"
          ? "Generating..."
          : "Get Recommendations",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-gray-900">
      {/* ==========================================
          Main
      ========================================== */}
      <main className="mx-auto max-w-[1450px] px-4 py-7 sm:px-6 lg:px-8">

        {/* ========================================
            Top Navigation
        ======================================== */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft
              size={17}
              className="transition group-hover:-translate-x-1"
            />
            Back
          </button>

          <div className="hidden items-center gap-2 text-xs font-medium text-gray-400 sm:flex">
            <BrainCircuit size={15} />
            JobTrack AI
          </div>
        </div>

        {/* ========================================
            Hero
        ======================================== */}
        <section className="relative mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 shadow-[0_15px_50px_rgba(15,23,42,0.12)]">
          {/* Glow */}
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_330px] lg:p-10">

            {/* Hero Copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-indigo-200">
                <Sparkles size={13} />
                AI-powered career workspace
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[44px] lg:leading-[1.08]">
                Turn any job description into a{" "}
                <span className="text-indigo-300">
                  clear career strategy.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
                Analyze requirements, compare your resume,
                uncover skill gaps, prepare for interviews,
                and get personalized recommendations —
                all in one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <HeroPill icon={FileSearch} text="Job Analysis" />
                <HeroPill icon={Target} text="Resume Match" />
                <HeroPill icon={BarChart3} text="Skill Gaps" />
                <HeroPill icon={MessageSquareText} text="Interview Prep" />
              </div>
            </div>

            {/* Hero Side Card */}
            <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                  <BrainCircuit
                    size={19}
                    className="text-indigo-300"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Complete Analysis
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Five AI engines working together
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <MiniFeature icon={FileSearch} label="Job Analysis" />
                <MiniFeature icon={Target} label="Resume Matching" />
                <MiniFeature icon={BarChart3} label="Skill Gap Analysis" />
                <MiniFeature icon={MessageSquareText} label="Interview Preparation" />
                <MiniFeature icon={Lightbulb} label="Career Recommendations" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            Job Description Input
        ======================================== */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                  <FileSearch
                    size={17}
                    className="text-indigo-600"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Job Description
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Paste the job description you want AI to analyze.
                  </p>
                </div>
              </div>

              {hasResults && (
                <button
                  type="button"
                  onClick={clearResults}
                  className="inline-flex items-center gap-1.5 self-start rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 sm:self-auto"
                >
                  <RefreshCcw size={13} />
                  Clear Results
                </button>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6">

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(e.target.value)
                }
                placeholder="Paste the complete job description here..."
                rows={11}
                maxLength={15000}
                className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3.5 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

              <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-medium text-gray-400 shadow-sm">
                {jobDescription.length}/15000
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-[11px] text-gray-400">
                Minimum 50 characters
              </p>

              {jobDescription.length >= 50 && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <Check size={13} />
                  Ready for analysis
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <TriangleAlert
                  size={17}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Complete Analysis */}
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <Zap
                    size={16}
                    className="text-indigo-600"
                  />

                  <p className="text-sm font-semibold text-gray-900">
                    Need the full picture?
                  </p>
                </div>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Run all five AI tools and get a complete
                  career analysis from one job description.
                </p>
              </div>

              <button
                type="button"
                onClick={runAllFeatures}
                disabled={loading}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {activeFeature === "all" ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                    Running AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Run Complete Analysis
                  </>
                )}
              </button>
            </div>

            {/* Feature Cards */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {features.map((feature) => {
                const FeatureIcon = feature.icon;

                return (
                  <div
                    key={feature.id}
                    className="group rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-sm"
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${feature.iconBg}`}
                    >
                      <FeatureIcon
                        size={17}
                        className={feature.iconColor}
                      />
                    </div>

                    <h3 className="mt-3 text-sm font-semibold text-gray-900">
                      {feature.title}
                    </h3>

                    <p className="mt-1.5 min-h-[60px] text-[11px] leading-5 text-gray-500">
                      {feature.description}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        runFeature(feature.id)
                      }
                      disabled={loading}
                      className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {activeFeature === feature.id ? (
                        <>
                          <Loader2
                            size={13}
                            className="animate-spin"
                          />
                          {feature.button}
                        </>
                      ) : (
                        <>
                          {feature.button}
                          <ArrowRight size={13} />
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================
            Results Header
        ======================================== */}
        {hasResults && (
          <div className="mt-8 mb-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit
                  size={19}
                  className="text-indigo-600"
                />

                <h2 className="text-xl font-bold tracking-tight text-gray-950">
                  AI Insights
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Your results are organized below by analysis area.
              </p>
            </div>

            <button
              type="button"
              onClick={clearResults}
              className="hidden items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 sm:flex"
            >
              Start fresh
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* ========================================
            Job Analysis
        ======================================== */}
        {jobAnalysis && (
          <ResultSection
            icon={FileSearch}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            title="Job Analysis"
            subtitle="Understand what this role is really asking for."
          >
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
              <p className="text-sm leading-7 text-gray-700">
                {jobAnalysis.summary}
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoList
                title="Required Skills"
                items={jobAnalysis.requiredSkills}
                color="blue"
              />

              <InfoList
                title="Preferred Skills"
                items={jobAnalysis.preferredSkills}
                color="violet"
              />

              <InfoList
                title="Technologies"
                items={jobAnalysis.technologies}
                color="indigo"
              />

              <InfoList
                title="Key Responsibilities"
                items={jobAnalysis.keyResponsibilities}
                color="gray"
              />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <InfoBox
                title="Experience"
                value={jobAnalysis.experienceRequired}
              />

              <InfoBox
                title="Education"
                value={
                  jobAnalysis.educationRequirements
                }
              />

              <InfoBox
                title="Experience Level"
                value={jobAnalysis.experienceLevel}
              />
            </div>
          </ResultSection>
        )}

        {/* ========================================
            Resume Match
        ======================================== */}
        {resumeMatch && (
          <ResultSection
            icon={Target}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
            title="Resume Match"
            subtitle="See how closely your current profile fits this role."
          >
            <div className="grid gap-5 lg:grid-cols-[210px_1fr]">

              {/* Score */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-violet-100 bg-violet-50/50 p-6">
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[10px] border-violet-100 bg-white shadow-sm">
                  <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-violet-500 border-r-violet-400" />

                  <div className="text-center">
                    <p className="text-4xl font-bold tracking-tight text-violet-700">
                      {resumeMatch.matchScore}
                    </p>

                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Match
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-gray-500">
                  Resume Match Score
                </p>
              </div>

              {/* Lists */}
              <div className="grid gap-4 md:grid-cols-3">
                <InfoList
                  title="Matched Skills"
                  items={resumeMatch.matchedSkills}
                  color="emerald"
                />

                <InfoList
                  title="Missing Skills"
                  items={resumeMatch.missingSkills}
                  color="red"
                />

                <InfoList
                  title="Strengths"
                  items={resumeMatch.strengths}
                  color="violet"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
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

            <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Assessment
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {resumeMatch.assessment}
              </p>
            </div>
          </ResultSection>
        )}

        {/* ========================================
            Skill Gap
        ======================================== */}
        {skillGap && (
          <ResultSection
            icon={BarChart3}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
            title="Skill Gap Analysis"
            subtitle="Know what to improve before moving forward."
          >
            <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4 sm:p-5">
              <p className="text-sm leading-7 text-gray-700">
                {skillGap.summary}
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <InfoList
                title="Required Skills"
                items={skillGap.requiredSkills}
                color="orange"
              />

              <InfoList
                title="Matched Skills"
                items={skillGap.matchedSkills}
                color="emerald"
              />

              <InfoList
                title="Missing Skills"
                items={skillGap.missingSkills}
                color="red"
              />
            </div>

            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Skill Gaps
                </h3>

                <span className="text-xs text-gray-400">
                  {skillGap.skillGaps?.length || 0} identified
                </span>
              </div>

              <div className="space-y-3">
                {skillGap.skillGaps?.map(
                  (gap, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-orange-200 hover:shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-semibold text-gray-900">
                          {gap.skill}
                        </h4>

                        <PriorityBadge
                          priority={gap.priority}
                        />
                      </div>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {gap.reason}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </ResultSection>
        )}

        {/* ========================================
            Interview Preparation
        ======================================== */}
        {interviewPrep && (
          <ResultSection
            icon={MessageSquareText}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            title="Interview Preparation"
            subtitle="Prepare around the actual role instead of guessing."
          >
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                Preparation Summary
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {interviewPrep.preparationSummary}
              </p>
            </div>

            <div className="mt-5 space-y-5">
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
          </ResultSection>
        )}

        {/* ========================================
            Recommendations
        ======================================== */}
        {recommendations && (
          <ResultSection
            icon={Lightbulb}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            title="Personalized Recommendations"
            subtitle="Turn this analysis into practical next steps."
            last
          >
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-gray-900">
                Profile Summary
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {recommendations.profileSummary}
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {recommendations.recommendations?.map(
                (item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                        {item.area}
                      </span>

                      <PriorityBadge
                        priority={item.priority}
                      />
                    </div>

                    <h4 className="mt-4 text-sm font-semibold leading-6 text-gray-900">
                      {item.recommendation}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {item.reason}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoList
                title="Strengths"
                items={
                  recommendations.strengths
                }
                color="emerald"
              />

              <InfoList
                title="Focus Areas"
                items={
                  recommendations.focusAreas
                }
                color="amber"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200">
                  <Sparkles
                    size={16}
                    className="text-indigo-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Ready to act on these insights?
                  </p>

                  <p className="text-xs text-gray-500">
                    Keep your application pipeline updated while you prepare.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/applications")
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
              >
                View Applications
                <ArrowRight size={14} />
              </button>
            </div>
          </ResultSection>
        )}

        {/* ========================================
            Empty State
        ======================================== */}
        {!hasResults && (
          <section className="mt-8 mb-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
              <BrainCircuit
                size={25}
                className="text-indigo-600"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              Your AI workspace is ready
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Paste a job description above and choose an AI
              tool, or run the complete analysis to get all
              insights together.
            </p>
          </section>
        )}

        {/* Footer */}
        <div className="py-6 text-center">
          <p className="text-xs text-gray-400">
            JobTrack AI · Make smarter career decisions.
          </p>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// Hero Pill
// ==========================================
function HeroPill({ icon: Icon, text }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-gray-300">
      <Icon size={13} />
      {text}
    </div>
  );
}

// ==========================================
// Mini Feature
// ==========================================
function MiniFeature({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
        <Icon
          size={14}
          className="text-indigo-300"
        />
      </div>

      <span className="text-xs text-gray-300">
        {label}
      </span>

      <Check
        size={14}
        className="ml-auto text-emerald-400"
      />
    </div>
  );
}

// ==========================================
// Result Section
// ==========================================
function ResultSection({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  children,
}) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}
          >
            <Icon
              size={17}
              className={iconColor}
            />
          </div>

          <div>
            <h2 className="text-base font-bold tracking-tight text-gray-950">
              {title}
            </h2>

            <p className="mt-0.5 text-xs text-gray-400">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

// ==========================================
// Info List
// ==========================================
function InfoList({
  title,
  items = [],
  color = "gray",
}) {
  const colors = {
    blue:
      "bg-blue-50 text-blue-700 border-blue-100",
    violet:
      "bg-violet-50 text-violet-700 border-violet-100",
    indigo:
      "bg-indigo-50 text-indigo-700 border-indigo-100",
    orange:
      "bg-orange-50 text-orange-700 border-orange-100",
    emerald:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
    red:
      "bg-red-50 text-red-700 border-red-100",
    amber:
      "bg-amber-50 text-amber-700 border-amber-100",
    gray:
      "bg-gray-50 text-gray-700 border-gray-100",
  };

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">
        {title}
      </h3>

      {items?.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-xs text-gray-400">
          No information available.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${colors[color] || colors.gray}`}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// Info Box
// ==========================================
function InfoBox({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-gray-700">
        {value || "Not specified"}
      </p>
    </div>
  );
}

// ==========================================
// Priority Badge
// ==========================================
function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-red-50 text-red-700 border-red-100",
    Medium:
      "bg-amber-50 text-amber-700 border-amber-100",
    Low:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
        styles[priority] ||
        "bg-gray-50 text-gray-600 border-gray-100"
      }`}
    >
      {priority}
    </span>
  );
}

// ==========================================
// Question Section
// ==========================================
function QuestionSection({
  title,
  questions = [],
  type,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">
          {title}
        </h3>

        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {questions.length} questions
        </span>
      </div>

      <div className="space-y-3">
        {questions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-5 text-center">
            <p className="text-xs text-gray-400">
              No questions available.
            </p>
          </div>
        ) : (
          questions.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                    {index + 1}
                  </div>

                  <h4 className="text-sm font-semibold leading-6 text-gray-900">
                    {item.question}
                  </h4>
                </div>

                {type === "technical" &&
                  item.difficulty && (
                    <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                      {item.difficulty}
                    </span>
                  )}
              </div>

              {item.topic && (
                <p className="mt-3 ml-10 text-[11px] font-medium text-gray-400">
                  Topic: {item.topic}
                </p>
              )}

              {item.reason && (
                <div className="mt-4 ml-10 rounded-lg bg-gray-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Why this question?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    {item.reason}
                  </p>
                </div>
              )}

              {item.whatInterviewerEvaluates && (
                <div className="mt-3 ml-10 rounded-lg bg-gray-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Interviewer evaluates
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    {item.whatInterviewerEvaluates}
                  </p>
                </div>
              )}

              {item.answerPoints?.length > 0 && (
                <div className="mt-4 ml-10">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Answer Points
                  </p>

                  <ul className="mt-2 space-y-1.5">
                    {item.answerPoints.map(
                      (point, pointIndex) => (
                        <li
                          key={pointIndex}
                          className="flex items-start gap-2 text-xs leading-5 text-gray-600"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-indigo-500" />
                          {point}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AIAnalyzer;