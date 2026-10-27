import { useEffect } from "react";
import { TrashIcon, CloseIcon, AlertCircleIcon } from "./Icons";

export function DeleteConfirmModal({ project, onConfirm, onCancel, isDeleting }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap danger">
            <span className="danger-icon-badge">
              <AlertCircleIcon size={22} />
            </span>
            <h3>Delete Project</h3>
          </div>
          <button className="icon-btn-close" onClick={onCancel} aria-label="Close modal">
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p>
            Are you sure you want to delete <strong>&ldquo;{project.name}&rdquo;</strong>?
          </p>
          <p className="delete-warning">
            This will permanently remove the project from the database. This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(project.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <TrashIcon size={16} /> Delete Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
