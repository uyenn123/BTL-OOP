
package com.flowtask.backend.dto.Response;

import java.time.Instant;

public record NotificationView(
        Long id,
        String message,
        boolean read,
        Instant createdAt
) {}
