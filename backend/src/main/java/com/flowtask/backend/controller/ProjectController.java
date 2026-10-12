package com.flowtask.backend.controller;

import com.flowtask.backend.dto.Request.ProjectRequest;
import com.flowtask.backend.dto.Response.ProjectView;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.flowtask.backend.dto.Response.ProjectMemberView;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public List<ProjectView> all(@AuthenticationPrincipal User user) {
        return projectService.getAll(user);
    }

    @GetMapping("/{id}")
    public ProjectView one(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return projectService.getOne(id, user);
    }

    @GetMapping("/{id}/members")
    public List<ProjectMemberView> members(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return projectService.getMembers(id, user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectView create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProjectRequest request) {
        return projectService.create(user, request);
    }

    @PutMapping("/{id}")
    public ProjectView update(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProjectRequest request) {
        return projectService.update(id, user, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        projectService.delete(id, user);
    }
}