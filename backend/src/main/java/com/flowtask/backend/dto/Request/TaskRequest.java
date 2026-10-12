package com.flowtask.backend.dto.Request;

import com.flowtask.backend.entity.Priority;
import com.flowtask.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record TaskRequest(
        @NotBlank String title,
        String description,
        @NotNull Long projectId,
        Long assigneeId,
        @NotNull TaskStatus status,
        @NotNull Priority priority,
        List<String> tags,
        LocalDate dueDate,
        int position
) {}