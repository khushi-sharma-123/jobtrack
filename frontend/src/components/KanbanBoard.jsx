

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
import { useState } from "react";
import API from "../services/api";

const columns = [
  "Applied",
  "Interview",
  "Offer",
  "Selected",
  "Rejected",
];

const columnColors = {
  Applied: "bg-blue-50 border-blue-200",
  Interview: "bg-yellow-50 border-yellow-200",
  Offer: "bg-purple-50 border-purple-200",
  Selected: "bg-green-50 border-green-200",
  Rejected: "bg-red-50 border-red-200",
};

const SortableCard = ({ application }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: application._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md active:cursor-grabbing"
    >
      <h3 className="font-semibold text-gray-900">
        {application.position}
      </h3>

      <p className="mt-1 text-sm text-gray-600">
        {application.company}
      </p>

      {application.location && (
        <p className="mt-2 text-xs text-gray-500">
          {application.location}
        </p>
      )}

      {application.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {application.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const KanbanColumn = ({
  status,
  applications,
}) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[350px] rounded-xl border p-3 ${
        columnColors[status]
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">
          {status}
        </h2>

        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-gray-600 shadow-sm">
          {applications.length}
        </span>
      </div>

      <SortableContext
        items={applications.map((app) => app._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-[280px] space-y-3">
          {applications.map((application) => (
            <SortableCard
              key={application._id}
              application={application}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

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

    if (!newStatus || newStatus === application.status) {
      return;
    }

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
    }
  };

  const getApplicationsByStatus = (status) => {
    return applications.filter(
      (application) =>
        application.status === status
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {columns.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={getApplicationsByStatus(status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApplication ? (
          <div className="w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
            <h3 className="font-semibold text-gray-900">
              {activeApplication.position}
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              {activeApplication.company}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;

