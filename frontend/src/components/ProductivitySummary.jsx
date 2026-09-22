import {
  ArrowRight,
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Target,
} from "lucide-react";

function ProductivitySummary({
  applications = [],
  onOpenApplication,
  onOpenEmail,
  onViewApplications,
  onCompleteFollowUp,
}) {
  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const tomorrowStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const nextWeekStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 7
  );

  const getDateStart = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  };

  const formatDate = (value) => {
    const date = getDateStart(value);

    if (!date) return "No date";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getFollowUpLabel = (value) => {
    const date = getDateStart(value);

    if (!date) return "No follow-up date";

    if (date < todayStart) {
      const difference =
        todayStart.getTime() - date.getTime();

      const daysLate = Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );

      return daysLate === 1
        ? "1 day overdue"
        : `${daysLate} days overdue`;
    }

    if (date.getTime() === todayStart.getTime()) {
      return "Due today";
    }

    const difference =
      date.getTime() - todayStart.getTime();

    const daysAway = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    if (daysAway === 1) {
      return "Tomorrow";
    }

    return `In ${daysAway} days`;
  };

  const pendingFollowUps = applications
    .filter(
      (application) =>
        application.followUpDate &&
        !application.followUpCompleted
    )
    .sort(
      (first, second) =>
        new Date(first.followUpDate) -
        new Date(second.followUpDate)
    );

  const overdueFollowUps = pendingFollowUps.filter(
    (application) => {
      const date = getDateStart(application.followUpDate);
      return date && date < todayStart;
    }
  );

  const todayFollowUps = pendingFollowUps.filter(
    (application) => {
      const date = getDateStart(application.followUpDate);

      return (
        date &&
        date >= todayStart &&
        date < tomorrowStart
      );
    }
  );

  const upcomingFollowUps = pendingFollowUps.filter(
    (application) => {
      const date = getDateStart(application.followUpDate);
      return date && date >= tomorrowStart;
    }
  );

  const completedInterviewsStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7
  );

  const interviewApplications = applications.filter(
    (application) =>
      application.interviewDate &&
      application.status !== "Rejected"
  );

  const upcomingInterviews = interviewApplications
    .filter((application) => {
      const interviewDate = getDateStart(
        application.interviewDate
      );

      return (
        interviewDate &&
        interviewDate >= todayStart &&
        interviewDate < nextWeekStart
      );
    })
    .sort(
      (first, second) =>
        new Date(first.interviewDate) -
        new Date(second.interviewDate)
    );

  const completedInterviews = interviewApplications
    .filter((application) => {
      const interviewDate = getDateStart(
        application.interviewDate
      );

      return (
        interviewDate &&
        interviewDate < todayStart &&
        interviewDate >= completedInterviewsStart
      );
    })
    .sort(
      (first, second) =>
        new Date(second.interviewDate) -
        new Date(first.interviewDate)
    );

  const getInterviewLabel = (value) => {
    const date = getDateStart(value);

    if (!date) return "Interview";

    if (date < todayStart) {
      return "Interview completed";
    }

    if (date.getTime() === todayStart.getTime()) {
      return "Interview today";
    }

    if (date.getTime() === tomorrowStart.getTime()) {
      return "Interview tomorrow";
    }

    const difference =
      date.getTime() - todayStart.getTime();

    const daysAway = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    return `Interview in ${daysAway} days`;
  };

  const actionItems = [
    ...overdueFollowUps.map((application) => ({
      id: `follow-up-${application._id}`,
      applicationId: application._id,
      type: "follow-up",
      priority: 1,
      title: application.position,
      company: application.company,
      label: getFollowUpLabel(application.followUpDate),
      date: application.followUpDate,
      action: "Follow up now",
      icon: AlertCircle,
      iconClasses: "bg-red-50 text-red-600",
      badgeClasses:
        "bg-red-50 text-red-700 border-red-200",
    })),

    ...todayFollowUps.map((application) => ({
      id: `today-${application._id}`,
      applicationId: application._id,
      type: "follow-up",
      priority: 2,
      title: application.position,
      company: application.company,
      label: "Due today",
      date: application.followUpDate,
      action: "Follow up today",
      icon: Clock,
      iconClasses: "bg-amber-50 text-amber-600",
      badgeClasses:
        "bg-amber-50 text-amber-700 border-amber-200",
    })),

    ...upcomingInterviews.map((application) => ({
      id: `interview-${application._id}`,
      applicationId: application._id,
      type: "interview",
      priority: 3,
      title: application.position,
      company: application.company,
      label: getInterviewLabel(application.interviewDate),
      date: application.interviewDate,
      action: "View interview",
      icon: Calendar,
      iconClasses: "bg-violet-50 text-violet-600",
      badgeClasses:
        "bg-violet-50 text-violet-700 border-violet-200",
    })),

    ...completedInterviews.slice(0, 3).map((application) => ({
      id: `completed-interview-${application._id}`,
      applicationId: application._id,
      type: "interview",
      priority: 5,
      title: application.position,
      company: application.company,
      label: "Interview completed",
      date: application.interviewDate,
      action: "View interview",
      icon: CheckCircle,
      iconClasses: "bg-emerald-50 text-emerald-600",
      badgeClasses:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    })),

    ...upcomingFollowUps.slice(0, 5).map((application) => ({
      id: `upcoming-${application._id}`,
      applicationId: application._id,
      type: "follow-up",
      priority: 4,
      title: application.position,
      company: application.company,
      label: getFollowUpLabel(application.followUpDate),
      date: application.followUpDate,
      action: "View follow-up",
      icon: Mail,
      iconClasses: "bg-blue-50 text-blue-600",
      badgeClasses:
        "bg-blue-50 text-blue-700 border-blue-200",
    })),
  ]
    .sort((first, second) => {
      if (first.priority !== second.priority) {
        return first.priority - second.priority;
      }

      return (
        new Date(first.date) -
        new Date(second.date)
      );
    })
    .slice(0, 6);

  const totalPendingActions =
    overdueFollowUps.length +
    todayFollowUps.length +
    upcomingInterviews.length;

  const handleOpen = (applicationId) => {
    if (typeof onOpenApplication === "function") {
      onOpenApplication(applicationId);
    }
  };

  const handleEmail = (application) => {
    if (typeof onOpenEmail === "function") {
      onOpenEmail(application);
    }
  };

  return (
    <section className="mb-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
              <Target
                size={17}
                className="text-indigo-600"
              />
            </div>

            <h2 className="text-[19px] font-semibold tracking-tight text-gray-900">
              Today&apos;s Job Search
            </h2>
          </div>

          <p className="mt-1.5 text-sm text-gray-500">
            Focus on the applications that need your attention first.
          </p>
        </div>

        {typeof onViewApplications === "function" && (
          <button
            type="button"
            onClick={onViewApplications}
            className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-indigo-600 transition hover:text-indigo-700 sm:self-auto"
          >
            View applications
            <ArrowRight size={15} />
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overdue */}
        <div className="rounded-xl border border-red-100 bg-red-50/60 p-4 transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-red-700">
              Overdue
            </p>

            <AlertCircle
              size={17}
              className="text-red-500"
            />
          </div>

          <p className="mt-2 text-[26px] font-bold leading-none text-red-800">
            {overdueFollowUps.length}
          </p>

          <p className="mt-2 text-[11px] leading-4 text-red-600">
            Follow-ups needing attention
          </p>
        </div>

        {/* Due Today */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4 transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-amber-700">
              Due Today
            </p>

            <Clock
              size={17}
              className="text-amber-500"
            />
          </div>

          <p className="mt-2 text-[26px] font-bold leading-none text-amber-800">
            {todayFollowUps.length}
          </p>

          <p className="mt-2 text-[11px] leading-4 text-amber-700">
            Follow-ups planned for today
          </p>
        </div>

        {/* Interviews */}
        <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4 transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-violet-700">
              Interviews
            </p>

            <Calendar
              size={17}
              className="text-violet-500"
            />
          </div>

          <p className="mt-2 text-[26px] font-bold leading-none text-violet-800">
            {upcomingInterviews.length}
          </p>

          <p className="mt-2 text-[11px] leading-4 text-violet-700">
            Within the next 7 days
          </p>
        </div>

        {/* Pending Actions */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-indigo-700">
              Pending Actions
            </p>

            <CheckCircle
              size={17}
              className="text-indigo-500"
            />
          </div>

          <p className="mt-2 text-[26px] font-bold leading-none text-indigo-800">
            {totalPendingActions}
          </p>

          <p className="mt-2 text-[11px] leading-4 text-indigo-700">
            Items requiring attention
          </p>
        </div>
      </div>

      {/* Priority Actions */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900">
              Priority Actions
            </h3>

            <p className="mt-0.5 text-xs text-gray-500">
              Start with overdue and time-sensitive items.
            </p>
          </div>

          <div className="hidden h-8 w-8 items-center justify-center rounded-lg bg-gray-50 sm:flex">
            <Briefcase
              size={16}
              className="text-gray-400"
            />
          </div>
        </div>

        {/* Empty State */}
        {actionItems.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle
                size={21}
                className="text-emerald-600"
              />
            </div>

            <p className="mt-3 text-sm font-medium text-gray-800">
              You&apos;re caught up
            </p>

            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-gray-500">
              No urgent follow-ups or interviews need your attention right now.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {actionItems.map((item) => {
              const ItemIcon = item.icon;

              const application = applications.find(
                (currentApplication) =>
                  currentApplication._id ===
                  item.applicationId
              );

              return (
                <div
                  key={item.id}
                  className="grid gap-3 px-5 py-3.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  {/* Application Info */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconClasses}`}
                    >
                      <ItemIcon size={16} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h4 className="truncate text-sm font-medium text-gray-900">
                          {item.title}
                        </h4>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${item.badgeClasses}`}
                        >
                          {item.label}
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-xs font-medium text-indigo-600">
                        {item.company}
                      </p>

                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {item.type === "interview"
                          ? `${item.label} · ${formatDate(item.date)}`
                          : `Follow-up · ${formatDate(item.date)}`}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    {item.type === "follow-up" &&
                      application &&
                      typeof onOpenEmail === "function" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleEmail(application)
                          }
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
                        >
                          <Mail size={14} />
                          Email
                        </button>
                      )}

                    {item.type === "follow-up" &&
                      application &&
                      typeof onCompleteFollowUp === "function" && (
                        <button
                          type="button"
                          onClick={() =>
                            onCompleteFollowUp(application._id)
                          }
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <CheckCircle size={14} />
                          Mark Complete
                        </button>
                      )}

                    <button
                      type="button"
                      onClick={() =>
                        handleOpen(item.applicationId)
                      }
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {item.action}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductivitySummary;