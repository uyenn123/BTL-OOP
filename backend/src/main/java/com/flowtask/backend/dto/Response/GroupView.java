package com.flowtask.backend.dto.Response;

import java.util.List;

public record GroupView(
        Long id,
        String name,
        String description,
        String color,
        long memberCount,
        long projectCount,
        List<String> avatars
) {}