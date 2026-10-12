package com.flowtask.backend.dto.Request;

import jakarta.validation.constraints.NotBlank;

public record GroupRequest(
        @NotBlank String name,
        String description,
        String color
) {}