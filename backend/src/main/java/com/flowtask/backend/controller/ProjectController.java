package com.flowtask.backend.controller;

import com.flowtask.backend.dto.ProjectRequest;
import com.flowtask.backend.entity.Project;
import com.flowtask.backend.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<Project> getProjects(
            @RequestParam(required = false) Project.ProjectStatus status,
            @RequestParam(required = false) String search) {
        return projectService.getProjects(status, search);
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(@RequestBody ProjectRequest request) {
        return projectService.createProject(request);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody ProjectRequest request) {
        return projectService.updateProject(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    // ---- Milestones ----

    // body: { "title": "Task API endpoints" }
    @PostMapping("/{id}/milestones")
    public Project addMilestone(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return projectService.addMilestone(id, body.get("title"));
    }

    // tick / bỏ tick 1 milestone theo vị trí trong danh sách
    @PatchMapping("/{id}/milestones/{index}")
    public Project toggleMilestone(@PathVariable Long id, @PathVariable int index) {
        return projectService.toggleMilestone(id, index);
    }

    // ---- Comments ----

    // body: { "author": "Nguyen Khoa", "content": "..." }
    @PostMapping("/{id}/comments")
    public Project addComment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return projectService.addComment(id, body.get("author"), body.get("content"));
    }
}
