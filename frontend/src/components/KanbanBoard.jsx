import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GripVertical,
  MapPin,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";

import { useState } from "react";
import API from "../services/api";

const columns = [
  "Applied",
  "Interview",
  "Offer",
  "Selected",
  "Rejected",
];

const columnConfig = {
  Applied: {
    bg: "bg-blue-50/70",
    border: "border-blue-100",
    headerBg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    dot: "bg-blue-500",
    icon: Briefcase,
    label: "Applications received",
  },

  Interview: {
    bg: "bg-amber-50/70",
    border: "border-amber-100",
    headerBg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    dot: "bg-amber-500",
    icon: CalendarDays,
    label: "Interview stage",
  },

  Offer: {
    bg: "bg-violet-50/70",
    border: "border-violet-100",
    headerBg: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    dot: "bg-violet-500",
    icon: Sparkles,
    label: "Offers received",
  },

  Selected: {
    bg: "bg-emerald-50/70",
    border: "border-emerald-100",
    headerBg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
    label: "Selected applications",
  },

  Rejected: {
    bg: "bg-red-50/70",
    border: "border-red-100",
    headerBg: "bg-red-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    dot: "bg-red-500",
    icon: XCircle,
    label: "Closed applications",
  },
};

/* ======================================================
   SORTABLE APPLICATION CARD
====================================================== */

const SortableCard = ({ application }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "Interview":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "Offer":
        return "bg-violet-50 text-violet-700 border-violet-100";

      case "Selected":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "Rejected":
        return "bg-red-50 text-red-700 border-red-100";

      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group touch-none select-none rounded-xl border bg-white p-4 transition ${
        isDragging
          ? "scale-[1.02] border-indigo-300 opacity-40 shadow-xl"
          : "border-gray-200 shadow-sm hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400 transition group-hover:bg-indigo-50 group-hover:text-indigo-500">
            <GripVertical size={14} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-gray-900">
              {application.position}
            </h3>

            <p className="mt-0.5 truncate text-xs font-medium text-indigo-600">
              {application.company}
            </p>
          </div>
        </div>

        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            columnConfig[application.status]?.dot ||
            "bg-gray-400"
          }`}
        />
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2">
        {application.location && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin
              size={13}
              className="shrink-0 text-gray-400"
            />

            <span className="truncate">
              {application.location}
            </span>
          </div>
        )}

        {application.jobType && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Briefcase
              size={13}
              className="shrink-0 text-gray-400"
            />

            <span>{application.jobType}</span>
          </div>
        )}

        {application.followUpDate && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock3
              size={13}
              className="shrink-0 text-gray-400"
            />

            <span>
              Follow-up{" "}
              {new Date(
                application.followUpDate
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {application.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {application.tags
            .slice(0, 3)
            .map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-500"
              >
                {tag}
              </span>
            ))}

          {application.tags.length > 3 && (
            <span className="rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-400">
              +{application.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span
          className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${getStatusStyle(
            application.status
          )}`}
        >
          {application.status}
        </span>

        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-400">
          Move
          <ChevronRight size={11} />
        </span>
      </div>
    </div>
  );
};

/* ======================================================
   KANBAN COLUMN
====================================================== */

const KanbanColumn = ({
  status,
  applications,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const config = columnConfig[status];
  const ColumnIcon = config.icon;

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[570px] w-[290px] shrink-0 rounded-2xl border p-2.5 transition ${
        isOver
          ? `${config.border} ring-2 ring-indigo-200`
          : `${config.border}`
      } ${config.bg}`}
    >
      {/* Column Header */}
      <div
        className={`rounded-xl ${config.headerBg} px-3.5 py-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}
            >
              <ColumnIcon
                size={15}
                className={config.iconColor}
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-gray-900">
                {status}
              </h2>

              <p className="truncate text-[10px] text-gray-500">
                {config.label}
              </p>
            </div>
          </div>

          <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-white bg-white px-2 text-[11px] font-bold text-gray-600 shadow-sm">
            {applications.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <SortableContext
        items={applications.map(
          (app) => app._id
        )}
        strategy={verticalListSortingStrategy}
      >
        <div className="mt-3 min-h-[470px] space-y-2.5">
          {applications.length > 0 ? (
            applications.map((application) => (
              <SortableCard
                key={application._id}
                application={application}
              />
            ))
          ) : (
            <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/50 px-5 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <Target
                  size={17}
                  className="text-gray-400"
                />
              </div>

              <p className="mt-3 text-xs font-semibold text-gray-500">
                No applications
              </p>

              <p className="mt-1 max-w-[180px] text-[10px] leading-4 text-gray-400">
                Drag an application here to move it into{" "}
                {status}.
              </p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

/* ======================================================
   DRAG OVERLAY
====================================================== */

const DraggedCard = ({ application }) => {
  if (!application) return null;

  return (
    <div className="w-[290px] rotate-1 rounded-xl border border-indigo-200 bg-white p-4 shadow-2xl shadow-indigo-200/40">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
          <Briefcase
            size={15}
            className="text-indigo-600"
          />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {application.position}
          </h3>

          <p className="mt-0.5 truncate text-xs font-medium text-indigo-600">
            {application.company}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          Moving application
        </span>

        <Sparkles
          size={14}
          className="text-indigo-500"
        />
      </div>
    </div>
  );
};

/* ======================================================
   KANBAN BOARD
====================================================== */

const KanbanBoard = ({
  applications,
  setApplications,
}) => {
  const [activeApplication, setActiveApplication] =
    useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    const application = applications.find(
      (app) => app._id === event.active.id
    );

    setActiveApplication(application || null);
  };

  const handleDragCancel = () => {
    setActiveApplication(null);
  };

  const handleDragEnd = async (event) => {
    setActiveApplication(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const application = applications.find(
      (app) => app._id === active.id
    );

    if (!application) {
      return;
    }

    const newStatus = columns.find(
      (status) => status === over.id
    );

    if (
      !newStatus ||
      newStatus === application.status
    ) {
      return;
    }

    const previousStatus = application.status;

    // Optimistic UI update
    setApplications((prev) =>
      prev.map((app) =>
        app._id === application._id
          ? {
              ...app,
              status: newStatus,
            }
          : app
      )
    );

    try {
      const response = await API.patch(
        `/applications/${application._id}/status`,
        {
          status: newStatus,
        }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app._id === application._id
            ? response.data.application
            : app
        )
      );
    } catch (error) {
      console.error(
        "Failed to update application status:",
        error
      );

      // Roll back optimistic update
      setApplications((prev) =>
        prev.map((app) =>
          app._id === application._id
            ? {
                ...app,
                status: previousStatus,
              }
            : app
        )
      );
    }
  };

  const getApplicationsByStatus = (status) => {
    return applications.filter(
      (application) =>
        application.status === status
    );
  };

  return (
    <div className="relative">
      {/* Board Header */}
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
            <Target
              size={17}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Application Pipeline
            </h2>

            <p className="mt-0.5 text-xs text-gray-400">
              Drag applications between stages to update their status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-50">
            <GripVertical size={13} />
          </div>

          Drag & drop
        </div>
      </div>

      {/* Horizontal Board */}
      <div className="overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
        >
          <div className="flex min-w-max gap-3">
            {columns.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                applications={getApplicationsByStatus(
                  status
                )}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={null}>
            {activeApplication ? (
              <DraggedCard
                application={activeApplication}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;