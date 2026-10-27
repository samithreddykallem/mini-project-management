import { useState, useEffect, useMemo, useCallback } from "react";
import { projectService } from "./services/projectService";
import { ProjectCard } from "./components/ProjectCard";
import { ProjectFormModal } from "./components/ProjectFormModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { ProjectFilter } from "./components/ProjectFilter";
import { StatsOverview } from "./components/StatsOverview";
import { Toast } from "./components/Toast";
import { PlusIcon, RefreshIcon, FolderIcon, AlertCircleIcon } from "./components/Icons";
import "./App.css";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Filter & Search states
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deletingProject, setDeletingProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  // Fetch all projects from API
  const loadProjects = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    setFetchError(null);
    try {
      const data = await projectService.getAllProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setFetchError(err.message);
      showToast(err.message, "error");
    } finally {
      if (!quiet) setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Counts for each category
  const counts = useMemo(() => {
    const res = {
      all: projects.length,
      notStarted: 0,
      inProgress: 0,
      completed: 0,
    };
    projects.forEach((p) => {
      if (p.status === "Not Started") res.notStarted++;
      else if (p.status === "In Progress") res.inProgress++;
      else if (p.status === "Completed") res.completed++;
    });
    return res;
  }, [projects]);

  // Filtered & searched projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Status filter
      if (activeFilter !== "ALL" && project.status !== activeFilter) {
        return false;
      }
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const nameMatch = project.name?.toLowerCase().includes(query);
        const descMatch = project.description?.toLowerCase().includes(query);
        if (!nameMatch && !descMatch) {
          return false;
        }
      }
      return true;
    });
  }, [projects, activeFilter, searchTerm]);

  // Handle open create modal
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsFormModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setIsFormModalOpen(true);
  };

  // Submit create or update
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        // Update project
        const updated = await projectService.updateProject(editingProject.id, formData);
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? updated : p))
        );
        showToast(`Project "${updated.name}" updated successfully!`);
      } else {
        // Create project
        const created = await projectService.createProject(formData);
        setProjects((prev) => [created, ...prev]);
        showToast(`Project "${created.name}" created successfully!`);
      }
      setIsFormModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick status update from card
  const handleQuickStatusChange = async (project, newStatus) => {
    try {
      const updated = await projectService.updateProject(project.id, {
        ...project,
        status: newStatus,
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? updated : p))
      );
      showToast(`Status updated to "${newStatus}" for "${project.name}"`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Prompt delete
  const handleDeletePrompt = (project) => {
    setDeletingProject(project);
  };

  // Confirm delete
  const handleDeleteConfirm = async (id) => {
    setIsDeleting(true);
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast("Project deleted successfully!");
      setDeletingProject(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* App Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand-wrap">
            <div className="brand-logo">
              <FolderIcon size={26} />
            </div>
            <div>
              <h1 className="brand-title">Project Management System</h1>
              <p className="brand-subtitle">
                Plan, track, and manage your projects and deadlines effortlessly
              </p>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="btn btn-secondary-outline btn-icon"
              onClick={() => loadProjects(false)}
              title="Refresh project list"
              disabled={isLoading}
            >
              <RefreshIcon size={16} className={isLoading ? "spin-animation" : ""} />
              <span className="btn-text">Refresh</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-add-project"
              onClick={handleOpenCreateModal}
            >
              <PlusIcon size={18} />
              <span>Add Project</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="main-content">
        <div className="content-container">
          {/* Stats Overview */}
          <StatsOverview
            counts={counts}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Filters & Search */}
          <ProjectFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            counts={counts}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="state-panel loading-panel">
              <div className="loading-spinner" />
              <p>Loading projects...</p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && fetchError && (
            <div className="state-panel error-panel">
              <AlertCircleIcon size={36} />
              <h3>Failed to load projects</h3>
              <p>{fetchError}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => loadProjects(false)}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State: No projects at all */}
          {!isLoading && !fetchError && projects.length === 0 && (
            <div className="state-panel empty-panel">
              <div className="empty-icon-wrap">
                <FolderIcon size={48} />
              </div>
              <h3>No projects yet</h3>
              <p>Get started by adding your first project with deadlines and milestones.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleOpenCreateModal}
              >
                <PlusIcon size={18} /> Add Your First Project
              </button>
            </div>
          )}

          {/* Empty State: Filters/Search returned 0 results */}
          {!isLoading &&
            !fetchError &&
            projects.length > 0 &&
            filteredProjects.length === 0 && (
              <div className="state-panel no-match-panel">
                <p className="no-match-title">No projects match the current filter</p>
                <p className="no-match-desc">
                  {searchTerm
                    ? `No projects matching "${searchTerm}" with status "${activeFilter}".`
                    : `No projects found with status "${activeFilter}".`}
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setActiveFilter("ALL");
                    setSearchTerm("");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}

          {/* Project Cards Grid */}
          {!isLoading && !fetchError && filteredProjects.length > 0 && (
            <div className="project-grid">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeletePrompt}
                  onStatusChange={handleQuickStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Project Modal */}
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsFormModalOpen(false);
            setEditingProject(null);
          }
        }}
        onSubmit={handleFormSubmit}
        initialProject={editingProject}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        project={deletingProject}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!isDeleting) setDeletingProject(null);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
}
