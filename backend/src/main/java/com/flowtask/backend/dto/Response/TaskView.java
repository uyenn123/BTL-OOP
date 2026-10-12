package com.flowtask.backend.dto.Response;
import com.flowtask.backend.entity.Priority;
import com.flowtask.backend.entity.TaskStatus;

import java.time.LocalDate;
import java.util.List;

public record TaskView(
        Long id,
        String title,
        String description,
        Long projectId,
        String projectName,
        Long workspaceId,
        String workspaceName,
        String groupName,
        Long assigneeId,
        String assigneeName,
        String assigneeInitials,
        TaskStatus status,
        Priority priority,
        List<String> tags,
        LocalDate dueDate,
        int position,
        String color
) {}