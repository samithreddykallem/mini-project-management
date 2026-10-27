
package com.example.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // Get all projects
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    // Get project by ID
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                projectService.getProjectById(id));
    }

    // Create project
    @PostMapping
    public ResponseEntity<Project> createProject(
            @RequestBody Project project) {
        Project created = projectService.createProject(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Update project
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long id,
            @RequestBody Project project) {
        return ResponseEntity.ok(
                projectService.updateProject(id, project));
    }

    // Delete project
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProject(
            @PathVariable Long id) {
        projectService.deleteProject(id);

        return ResponseEntity.ok(
                Map.of("message", "Project deleted successfully"));
    }

    // Handle validation errors
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleValidationError(
            IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(
                Map.of("error", ex.getMessage()));
    }

    // Handle missing projects
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeError(
            RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("error", ex.getMessage()));
    }
}
