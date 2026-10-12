package com.flowtask.backend.dto.Response;

import com.flowtask.backend.entity.Priority;
import com.flowtask.backend.entity.ProjectStatus;

import java.time.LocalDate;

public record ProjectView(
        Long id,
        String name,
        String description,
        Long groupId,
        String groupName,
        ProjectStatus status,
        Priority priority,
        String color,
        LocalDate deadline,
        long taskCount,
        long doneCount
) {
}