package com.flowtask.backend.dto.Response;

import com.flowtask.backend.entity.NotificationType;
import java.time.Instant;

public record NotificationView(
        Long id,
        String message,
        boolean read,
        Instant createdAt,
        Long projectId,
        Long taskId,
        NotificationType type
) {}
