import { useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "./Icons";
import { formatDate, getDeadlineStatus } from "../utils/formatters";

export function ProjectCard({ project, onEdit, onDelete, onStatusChange }) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const deadlineInfo = getDeadlineStatus(project.deadline, project.status);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "badge-completed";
      case "In Progress":
        return "badge-in-progress";
      case "Not Started":
      default:
        return "badge-not-started";
    }
  };

  const handleQuickStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === project.status) return;

    try {
      setIsUpdatingStatus(true);
      await onStatusChange(project, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const description = project.description || "";
  const isLongDescription = description.length > 160;

  return (
    <div className={`project-card status-border-${project.status.toLowerCase().replace(/\s+/g, "-")}`}>
      {/* Top Header: Title and Status Badge */}
      <div className="card-top">
        <div className="card-title-group">
          <h3 className="card-title" title={project.name}>
            {project.name}
          </h3>
        </div>
        <div className="card-badge-wrap">
          <span className={`status-badge ${getStatusBadgeClass(project.status)}`}>
            {project.status === "Completed" && <CheckCircleIcon size={13} />}
            {project.status === "In Progress" && <span className="status-dot pulsing" />}
            {project.status === "Not Started" && <span className="status-dot" />}
            {project.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="card-description-wrap">
        {description ? (
          <p className="card-description">
            {isLongDescription && !isExpanded
              ? `${description.slice(0, 150)}...`
              : description}
            {isLongDescription && (
              <button
                type="button"
                className="btn-text-link"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        ) : (
          <p className="card-description placeholder-desc">No description provided.</p>
        )}
      </div>

      {/* Dates Section */}
      <div className="card-meta">
        <div className="meta-item">
          <span className="meta-label">
            <CalendarIcon size={14} /> Start Date
          </span>
          <span className="meta-value">{formatDate(project.startDate) || "N/A"}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">
            <ClockIcon size={14} /> Deadline
          </span>
          <div className="deadline-value-group">
            <span className="meta-value">{formatDate(project.deadline) || "N/A"}</span>
            {deadlineInfo && (
              <span className={`deadline-tag tag-${deadlineInfo.type}`}>
                {deadlineInfo.type === "overdue" && <AlertCircleIcon size={12} />}
                {deadlineInfo.text}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Status Control and Actions */}
      <div className="card-footer">
        <div className="quick-status-selector">
          <label htmlFor={`quick-status-${project.id}`} className="status-label">
            Status:
          </label>
          <select
            id={`quick-status-${project.id}`}
            value={project.status}
            onChange={handleQuickStatusChange}
            disabled={isUpdatingStatus}
            className={`quick-select ${getStatusBadgeClass(project.status)}`}
            title="Quickly change project status"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="action-btn btn-edit"
            onClick={() => onEdit(project)}
            title="Edit project details"
          >
            <PencilIcon size={15} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="action-btn btn-delete"
            onClick={() => onDelete(project)}
            title="Delete project"
          >
            <TrashIcon size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
