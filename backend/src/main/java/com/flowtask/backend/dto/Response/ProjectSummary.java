package com.flowtask.backend.dto.Response;

public record ProjectSummary(
        Long id,
        String name,
        String color,
        long taskCount,
        long doneCount
) {
}