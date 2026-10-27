
package com.example.backend;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Arrays;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // Get all projects
    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Get project by ID
    @Transactional(readOnly = true)
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found with ID: " + id));
    }

    // Add project
    public Project createProject(Project project) {
        validateProject(project);
        return projectRepository.save(project);
    }

    // Update project
    public Project updateProject(Long id, Project updatedProject) {
        validateProject(updatedProject);

        Project existingProject = getProjectById(id);

        existingProject.setName(updatedProject.getName());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setStartDate(updatedProject.getStartDate());
        existingProject.setDeadline(updatedProject.getDeadline());
        existingProject.setStatus(updatedProject.getStatus());

        return projectRepository.save(existingProject);
    }

    // Delete project
    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }

    // Validate project details
    private void validateProject(Project project) {
        if (project.getName() == null ||
                project.getName().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Project name is required");
        }

        if (project.getStartDate() == null ||
                project.getDeadline() == null) {
            throw new IllegalArgumentException(
                    "Start date and deadline are required");
        }

        if (project.getDeadline().isBefore(project.getStartDate())) {
            throw new IllegalArgumentException(
                    "Deadline cannot be before start date");
        }

        List<String> validStatuses = Arrays.asList(
                "Not Started", "In Progress", "Completed");

        if (project.getStatus() == null ||
                !validStatuses.contains(project.getStatus())) {
            throw new IllegalArgumentException(
                    "Invalid status. Use Not Started, In Progress, or Completed");
        }
    }
}
