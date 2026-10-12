package com.flowtask.backend.controller;

import com.flowtask.backend.dto.Request.StatusRequest;
import com.flowtask.backend.dto.Request.TaskRequest;
import com.flowtask.backend.dto.Response.TaskView;
import com.flowtask.backend.entity.User;
import com.flowtask.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<TaskView> all(@AuthenticationPrincipal User user) {
        return taskService.all(user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskView create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TaskRequest request) {
        return taskService.create(request, user);
    }

    @PutMapping("/{id}")
    public TaskView update(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TaskRequest request) {
        return taskService.update(id, request, user);
    }

    @PatchMapping("/{id}/status")
    public TaskView status(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody StatusRequest request) {
        return taskService.updateStatus(id, request, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        taskService.delete(id, user);
    }
}
