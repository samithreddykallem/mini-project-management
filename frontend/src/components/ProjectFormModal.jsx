import { useState, useEffect } from "react";
import { CloseIcon, PlusIcon, PencilIcon, AlertCircleIcon } from "./Icons";
import { getTodayDateString, getDefaultDeadlineString } from "../utils/formatters";

export function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialProject = null,
  isSubmitting = false,
}) {
  const isEditMode = Boolean(initialProject);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: getTodayDateString(),
    deadline: getDefaultDeadlineString(),
    status: "Not Started",
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (initialProject) {
      setFormData({
        name: initialProject.name || "",
        description: initialProject.description || "",
        startDate: initialProject.startDate || getTodayDateString(),
        deadline: initialProject.deadline || getDefaultDeadlineString(),
        status: initialProject.status || "Not Started",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        startDate: getTodayDateString(),
        deadline: getDefaultDeadlineString(),
        status: "Not Started",
      });
    }
    setValidationErrors({});
  }, [initialProject, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name || !formData.name.trim()) {
      errors.name = "Project name is required";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }

    if (!formData.deadline) {
      errors.deadline = "Deadline is required";
    }

    if (formData.startDate && formData.deadline) {
      if (formData.deadline < formData.startDate) {
        errors.deadline = "Deadline cannot be earlier than start date";
      }
    }

    if (formData.description && formData.description.length > 1000) {
      errors.description = "Description cannot exceed 1000 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon-badge">
              {isEditMode ? <PencilIcon size={20} /> : <PlusIcon size={20} />}
            </span>
            <div>
              <h3>{isEditMode ? "Update Project Details" : "Create New Project"}</h3>
              <p className="modal-subtitle">
                {isEditMode
                  ? "Modify the details or current status of this project."
                  : "Fill in the project information below to add a new project."}
              </p>
            </div>
          </div>
          <button
            className="icon-btn-close"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body form-body">
            {/* Project Name */}
            <div className="form-group">
              <label htmlFor="projectName" className="form-label">
                Project Name <span className="required-star">*</span>
              </label>
              <input
                id="projectName"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Cloud Migration Phase 1"
                className={`form-input ${validationErrors.name ? "input-error" : ""}`}
                disabled={isSubmitting}
                autoFocus
              />
              {validationErrors.name && (
                <div className="field-error">
                  <AlertCircleIcon size={14} />
                  <span>{validationErrors.name}</span>
                </div>
              )}
            </div>

            {/* Status & Dates Row */}
            <div className="form-row">
              {/* Status */}
              <div className="form-group">
                <label htmlFor="projectStatus" className="form-label">
                  Status <span className="required-star">*</span>
                </label>
                <select
                  id="projectStatus"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                  disabled={isSubmitting}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Start Date <span className="required-star">*</span>
                </label>
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`form-input ${validationErrors.startDate ? "input-error" : ""}`}
                  disabled={isSubmitting}
                />
                {validationErrors.startDate && (
                  <div className="field-error">
                    <AlertCircleIcon size={14} />
                    <span>{validationErrors.startDate}</span>
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div className="form-group">
                <label htmlFor="deadline" className="form-label">
                  Deadline <span className="required-star">*</span>
                </label>
                <input
                  id="deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`form-input ${validationErrors.deadline ? "input-error" : ""}`}
                  disabled={isSubmitting}
                />
                {validationErrors.deadline && (
                  <div className="field-error">
                    <AlertCircleIcon size={14} />
                    <span>{validationErrors.deadline}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <div className="label-with-counter">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <span className="char-counter">
                  {formData.description ? formData.description.length : 0} / 1000
                </span>
              </div>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe project objectives, key milestones, or requirements..."
                className={`form-textarea ${validationErrors.description ? "input-error" : ""}`}
                disabled={isSubmitting}
                maxLength={1000}
              />
              {validationErrors.description && (
                <div className="field-error">
                  <AlertCircleIcon size={14} />
                  <span>{validationErrors.description}</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Saving..."
              ) : isEditMode ? (
                <>
                  <PencilIcon size={16} /> Save Changes
                </>
              ) : (
                <>
                  <PlusIcon size={16} /> Add Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
