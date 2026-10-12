package com.flowtask.backend.dto.Request;

import com.flowtask.backend.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record StatusRequest(
        @NotNull TaskStatus status,
        int position
) {}