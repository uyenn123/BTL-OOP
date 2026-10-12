package com.flowtask.backend.dto.Request;

import com.flowtask.backend.entity.Priority;
import com.flowtask.backend.entity.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ProjectRequest(
        @NotBlank String name,
        String description,
        @NotNull Long groupId,
        @NotNull ProjectStatus status,
        @NotNull Priority priority,
        String color,
        LocalDate deadline
) {}